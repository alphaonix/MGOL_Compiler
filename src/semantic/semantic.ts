import {symbolsTable} from "../lexicon/symbols";
import { Token } from "../lexicon/token";
import {Error} from "../error/error";

const OUT_PATH = 'output/program.c'
const fs = require('fs');
fs.writeFileSync(OUT_PATH,'');

const body = {
    header: [
    '#include <stdio.h>',
    'typedef char literal[256];',
    'void main(void)',
    '{'
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
        '',
        '}'
    ]
}

export class Semantic {
    public stack: Token[];
    private count: number;
    private output;

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
        type === 'inteiro' ? type = 'int' : type = 'double';
        const varTemp = 'T' + this.count.toString();
        this.output['tempVars'].push(type + ' ' + varTemp + ';')
        this.count++
    }

    rule (routine: string, ruleLength: number, tokenX: Token) {
        const top = this.stack.length - 1;
        let id: Token;
        switch (routine) {
            case '7': // L -> id vir L
                for (let token of this.stack) {
                    if (token.class === 'ID') {
                        token.type = this.latestType;
                        let cType = '';
                        if (token.type === 'inteiro') {
                            cType = 'int ';
                        } else if (token.type === 'real') {
                            cType = 'double ';
                        } else {
                            cType = 'literal ';
                        }
                        this.output.vars.push(cType + token.lex + ';')
                    }
                }
                break;

            case '8': // L -> id
                id = this.stack[top];
                id.type = this.latestType;
                let cType = '';
                if (id.type === 'inteiro') {
                    cType = 'int ';
                } else if (id.type === 'real') {
                    cType = 'double ';
                } else {
                    cType = 'literal ';
                }
                this.output.vars.push(cType + this.stack[top].lex + ';')
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
                if (id.type === 'inteiro') {
                    this.output.code.push(`scanf("%d", &${id.lex});`);
                } else if (id.type === 'real') {
                    this.output.code.push(`scanf("%lf", &${id.lex});`);
                } else {
                    this.output.code.push(`scanf("%s", ${id.lex});`);
                }
                break;

            case '14': // ES -> escreva ARG pt_v
                if (this.latestArg.type === 'inteiro') {
                    this.output.code.push(`printf("%d", ${this.latestArg.lex});`)
                } else if (this.latestArg.type === 'real') {
                    this.output.code.push(`printf("%lf", ${this.latestArg.lex});`)
                } else {
                    this.output.code.push(`printf("${this.latestArg.lex}");`)
                }
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
                this.output.code.push(`T${this.count}=${this.latestOprd[0].lex}${opm.lex}${this.latestOprd[1].lex};`);
                this.output.code.push(`${id.lex}=T${this.count};`);
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
                this.output.code.push(`${this.stack[0].lex}=${this.latestOprd[0].lex};`);
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
                tk.type === 'int' ? tk.type = 'inteiro' : tk.type = 'real';
                this.latestOprd.push(tk);
                break;

            case '25': // COND -> CAB CP
                this.output.code.push(`}`);
                break;

            case '26': // COND -> CAB CP
                this.output.code.push(`if(T${this.count-1})\n{`);
                break;

            case '27': // EXP_R -> OPRD opr OPRD
                if (this.latestOprd[0].type !== this.latestOprd[1].type) {
                    Error.hasError = true;
                    Error.semanticError(2, Error.line, Error.column);
                    this.latestOprd = [];
                    break;
                }
                const opr = this.stack[top];
                this.output.code.push(`T${this.count}=${this.latestOprd[0].lex}${opr.lex}${this.latestOprd[1].lex};`);
                this.latestExpR = `T${this.count}=${this.latestOprd[0].lex}${opr.lex}${this.latestOprd[1].lex}`;
                this.newTempVar(this.latestOprd[0].type);
                this.latestOprd = [];
                break;

            case '33': // R -> CABR CPR
                this.output.code.push(`${this.latestExpR};\n}`);
                break;

            case '34': // CABR -> repita ab_p EXP_R fc_p
                this.output.code.push(`while(T${this.count-1})\n{`);
                break;
        }
    }
}
