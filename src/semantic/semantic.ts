import {loadKeywordSymbols, symbolsTable} from "../lexicon/symbols";
import { Token } from "../lexicon/token";
import {Error} from "../error/error";

const OUT_PATH = 'output/program.c'
const fs = require('fs');
fs.writeFileSync(OUT_PATH,'');

const body = {
    header: [
    '#include <stdio.h>',
    'typedef char literal[256];',
    'void main(void){'
    ],
    tempVars: [
        '/*----Variaveis temporarias----*/'
    ],
    vars: [
        '/*------------------------------*/'
    ],
    code: [
        ''
    ],
    end: [
        '}'
    ]
}

export class Semantic {
    public stack: Token[];
    private count: number;
    private output;
    private control : boolean = false;
    private recoil : number = 1;
    private controlRule : boolean = false;

    private latestType: string;
    private latestExpR: string;
    private latestArg: Token;
    private latestOprd: Token[];

    constructor() {
        this.stack = [];
        this.output = body;
        this.count = 0;

        this.latestType = '';
        this.latestExpR = '';
        this.latestArg = {class: '', lex: '', type: ''};
        this.latestOprd = [];
    }

    body_construction () {
        
        for (let i = 0; i < this.output.header.length; i++) {
            fs.appendFileSync(OUT_PATH, this.output.header[i]);
            fs.appendFileSync(OUT_PATH, '\n');
        }        

        for (let i = 0; i < this.output.tempVars.length; i++) {
            fs.appendFileSync(OUT_PATH, this.output.tempVars[i]);
            fs.appendFileSync(OUT_PATH, '\n');
        } 

        for (let i = 0; i < this.output.vars.length; i++) {
            fs.appendFileSync(OUT_PATH, this.output.vars[i]);
            fs.appendFileSync(OUT_PATH, '\n');
        } 

        for (let i = 0; i < this.output.code.length; i++) {
            fs.appendFileSync(OUT_PATH, this.output.code[i]);
            fs.appendFileSync(OUT_PATH, '\n');
        } 

        for (let i = 0; i < this.output.end.length; i++) {
            fs.appendFileSync(OUT_PATH, this.output.end[i]);
            fs.appendFileSync(OUT_PATH, '\n');
        } 
    }

    newTempVar (type: any) {
        type === 'int' ? type = 'int' : type = 'double';

        let aux = this.recoil;

        if (aux > 1)
        {
            aux = 1;
        }

        const varTemp = 'T' + this.count.toString();
        this.output['tempVars'].push(generate_Tabs(aux) + type + ' ' + varTemp + ';')
        
        this.count++
    }

    generate_scanf (id : any) {
        if (id.type === 'int') {
            this.output.code.push(generate_Tabs(this.recoil) + `scanf("%d", &${id.lex});`);
        } else if (id.type === 'double') {
            this.output.code.push(generate_Tabs(this.recoil) + `scanf("%lf", &${id.lex});`);
        } else {
            this.output.code.push(generate_Tabs(this.recoil) + `scanf("%s", ${id.lex});`);
        }
    }

    generate_printf () {
        if (this.latestArg.type === 'int') {
            this.output.code.push(generate_Tabs(this.recoil) + `printf("%d", ${this.latestArg.lex});`)
        } else if (this.latestArg.type === 'double') {
            this.output.code.push(generate_Tabs(this.recoil) + `printf("%lf", ${this.latestArg.lex});`)
        } else if (this.latestArg.type === 'literal') {
            this.control === true ? this.output.code.push(generate_Tabs(this.recoil) + `printf("%s", ${this.latestArg.lex});`) : this.output.code.push(generate_Tabs(this.recoil) + `printf("${this.latestArg.lex}");`);
        } 
    }

    rule (routine: string) {
        const top = this.stack.length - 1;
        let id: Token;

        switch (routine) {
           
            case '7': // L -> id vir L
            id = this.stack[top];
            if (this.controlRule === true)
            {
                this.controlRule = false;
                break;
            }

            for (let token of this.stack) {
                if (token.class === 'ID') {
                    token.type = this.latestType;
                    if (token.type === 'inteiro') {
                        token.type = 'int';
                    } else if (token.type === 'real') {
                        token.type = 'double';
                    } else {
                        token.type = 'literal';
                    }
                    this.output.vars.push(generate_Tabs(this.recoil) + token.type + ' ' + token.lex + ';')
                }
            }
            this.controlRule = true;
            break;

            case '8': // L -> id
                id = this.stack[top];
                id.type = this.latestType;
                if (id.type === 'inteiro') {
                    id.type = 'int';
                } else if (id.type === 'real') {
                    id.type = 'double';
                } else {
                    id.type = 'literal';
                } 
                        
                this.output.vars.push(generate_Tabs(this.recoil) + id.type + ' ' + this.stack[top].lex + ';');
                break;

            case '9': // TIPO -> inteiro
                this.latestType = 'inteiro';
                break;

            case '10': // TIPO -> real
                this.latestType = 'real';
                break;

            case '11': // TIPO -> literal
                this.latestType = 'literal';
                break;

            case '13': // ES -> leia id pt_v
                id = this.stack[1];
                if (id.type === null) {
                    Error.hasError = true;
                    Error.semanticError(1, Error.line, Error.column);
                    break;
                }
                this.generate_scanf(id);
                break;

            case '14': // ES -> escreva ARG pt_v
                this.generate_printf();
                this.control = false;
                break;

            case '15': // ARG -> lit
                this.latestArg = this.stack[top];
                this.latestArg.lex = this.latestArg.lex.replace(/"/g, '');
                break;

            case '16': // ARG -> num
                this.latestArg = this.stack[top];
                this.latestArg.lex = this.latestArg.lex.replace(/"/g, '');
                break;

            case '17': // ARG -> id
                if (this.stack[top] === null) {
                    Error.hasError = true;
                    Error.semanticError(1, Error.line, Error.column);
                    break;
                }
                this.control = true;
                this.latestArg = this.stack[top];
                this.latestArg.lex = this.latestArg.lex.replace(/"/g, '');
                break;

            case '20': // LD -> OPRD opm OPRD
                for (let i = 0; i < this.latestOprd.length; i++) {
                    if (this.latestOprd[i].type === 'literal'
                        || (this.latestOprd[0].type !== this.latestOprd[i].type)) {
                        Error.hasError = true;
                        Error.semanticError(2, Error.line, Error.column);
                        return;
                    }
                }
                id = this.stack[0];
                if (id.type !== this.latestOprd[0].type) {
                    Error.hasError = true;
                    Error.semanticError(3, Error.line, Error.column);
                    this.latestOprd = [];
                    return;
                }
                const opm = this.stack[2];
                this.output.code.push(generate_Tabs(this.recoil) + `T${this.count}=${this.latestOprd[0].lex}${opm.lex}${this.latestOprd[1].lex};`);
                this.output.code.push(generate_Tabs(this.recoil) + `${id.lex}=T${this.count};`);
                this.newTempVar(this.latestOprd[0].type);
                this.latestOprd = [];
                break;

            case '21': // LD -> OPRD
                if (this.latestOprd[0].type !== this.stack[0].type) {
                    Error.hasError = true;
                    Error.semanticError(3, Error.line, Error.column);
                    this.latestOprd = [];
                    break;
                }
                this.output.code.push(generate_Tabs(this.recoil) + `${this.stack[0].lex}=${this.latestOprd[0].lex};`);
                this.latestOprd = [];
                break;

            case '22': // OPRD -> id
                if (this.stack[top].type === null) {
                    Error.hasError = true;
                    Error.semanticError(1, Error.line, Error.column);
                    break;
                }
                this.latestOprd.push(this.stack[top]);
                break;

            case '23': // OPRD -> num
                const tk = this.stack[top];
                tk.type === 'inteiro' ? tk.type = 'int' : tk.type = 'double';
                this.latestOprd.push(tk);
                break;

            case '25': // COND -> CAB CP
                this.recoil--;
                this.output.code.push(generate_Tabs(this.recoil) + `}`);
                //this.count--;
                break;

            case '26': // COND -> CAB CP
                this.output.code.push(generate_Tabs(this.recoil) + `if(T${this.count-1}){`);
                this.recoil++;
                break;

            case '27': // EXP_R -> OPRD opr OPRD
                if (this.latestOprd[0].type !== this.latestOprd[1].type) {
                    Error.hasError = true;
                    Error.semanticError(2, Error.line, Error.column);
                    this.latestOprd = [];
                    break;
                }
                
                const opr = this.stack[top];
                this.output.code.push(generate_Tabs(this.recoil) + `T${this.count}=${this.latestOprd[0].lex}${opr.lex}${this.latestOprd[1].lex};`);
                this.latestExpR = `T${this.count}=${this.latestOprd[0].lex}${opr.lex}${this.latestOprd[1].lex}`;
                this.newTempVar(this.latestOprd[0].type);
                this.latestOprd = [];
                break;

            case '33': // R -> CABR CPR
                this.output.code.push(generate_Tabs(this.recoil) + `${this.latestExpR};`);
                this.recoil--;
                this.output.code.push(generate_Tabs(this.recoil) + `}`);
                break;

            case '34': // CABR -> repita ab_p EXP_R fc_p
                this.output.code.push(generate_Tabs(this.recoil) + `while(T${this.count-1}){`);
                this.recoil++;
                break;
        }
    }
}

function generate_Tabs (tabCount: number) {
    return '\t'.repeat(tabCount);
}