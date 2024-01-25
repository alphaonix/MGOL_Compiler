import { getTokenFromTable, symbolsTable } from "../lexicon/symbols";
import { Token } from "../lexicon/token";

const OUT_PATH = 'output/program.c'
const fs = require('fs');
fs.writeFileSync(OUT_PATH,'');

const body = {
    header: [
    '#include<stdio.h>',
    'typedef char literal[256];',
    'void main(void)', 
    '{'
    ],
    tempVars: [
        '/*----variaveis temporarias----*/'
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

    public stack: any[];
    private count : number;
    private output;

    constructor() {

        this.stack = [];
        this.output = body;
        this.count = 0;
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

    varTemp (type: any) {
        var varTemp = 'T' + this.count.toString();
        this.output['tempVars'].push(type + ' ' + varTemp + ';')
        this.count++
        return varTemp;
    }

    rule (routine: string, ruleLength: number, token: Token) {

        switch (routine) {

            case '5': //'5': {'LV':     ['varfim', 'pt_v']}

                this.output['tempVars'].push('');
                this.output['tempVars'].push('');
                this.output['tempVars'].push('');
                break;

            case '6': //'6': {'D':      ['TIPO', 'L', 'pt_v']}
                var semanticStack: any[] = [];

                for (let i = 0; i < ruleLength; i++) {

                    semanticStack.push(this.stack.pop());
                }
                var aux = semanticStack[2].type + ' ' + semanticStack[2].lex + ';'
                this.output['vars'].push(aux);
                //ds(symbolsTable);
                break;

            case '7': //'7': {'L':      ['id', 'vir', 'L']} //BUG NESSA REGRA
                
                console.log(this.stack);
                
                break;

            case '8': //'8': {'L':      ['id']}   

                //console.log(this.stack[2])

                var id = this.stack[2];
                if (id.type == 'inteiro') {
                    this.stack[2].type = 'int';
                }else if(id.type == 'literal') {
                    this.stack[2].type = 'literal';
                }else if (id.type == 'real') {
                    this.stack[2].type = 'double';
                }
                
                break;

            case '9': //'9': {'TIPO':   ['inteiro']}
                this.stack[this.stack.length - 1].type = getTokenFromTable('inteiro')?.class;
                break;

            case '10': //'10': {'TIPO':  ['real']}
                this.stack[this.stack.length - 1].type = getTokenFromTable('real')?.class;
                break

            case '11': //'11': {'TIPO':  ['literal']}
                this.stack[this.stack.length - 1].type = getTokenFromTable('literal')?.class;
                break;

            case '13': //'13': {'ES':    ['leia', 'id', 'pt_v']}

                var semanticStack: any[] = [];

                for (let i = 0; i < ruleLength; i++) {

                    semanticStack.push(this.stack.pop());
                }
                
                //console.log(semanticStack[2]);
                
                var id = semanticStack[2];
                if (id.type == 'literal') {
                    this.output['code'].push('scanf("%s", ' + id.lex + ');')
                } else if (id.type == 'int') {
                    this.output['code'].push('scanf("%d", &' + id.lex + ');')
                } else if (id.type == 'double') {
                    this.output['code'].push('scanf("%lf", &' + id.lex + ');')
                }
                break;

            case '14': // '14': {'ES':    ['escreva', 'ARG', 'pt_v']}

                var semanticStack: any[] = [];

                for (let i = 0; i < ruleLength; i++) {

                    semanticStack.push(this.stack.pop());
                }
                //d(semanticStack[1])
                if (semanticStack[1].type == 'int') {
                    this.output['code'].push('printf("%d",' + semanticStack[1].lex + ');');
                } else if (semanticStack[1].type == 'literal') {
                    this.output['code'].push('printf("%s",' + semanticStack[1].lex + ');');
                } else if (semanticStack[1].type == 'double') {
                    this.output['code'].push('printf("%lf",' + semanticStack[1].lex + ');');
                }
  
                break;
            
            case '15': // '15': {'ARG':   ['lit']}

                var semanticStack: any[] = [];
                semanticStack.push(this.stack.pop());
                semanticStack.push(this.stack.pop());
                
                this.stack.push(semanticStack[1]);

                break;

            case '16': //'16': {'ARG':   ['num']}

                var semanticStack: any[] = [];
                semanticStack.push(this.stack.pop());
                semanticStack.push(this.stack.pop());
                
                this.stack.push(semanticStack[1]);

                break;

            case '17': //'17': {'ARG':   ['id']}

                var semanticStack: any[] = [];
                semanticStack.push(this.stack.pop());
                semanticStack.push(this.stack.pop());
                
                this.stack.push(semanticStack[1]);
                //console.log(this.stack);
                break;

            case '19': //'19': {'CMD':   ['id', 'rcb', 'LD', 'pt_v']},

                //console.log(this.stack);

                var semanticStack : any[] = [];
                for (let i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                }
                var id = semanticStack[3];
                var rcb = semanticStack[2];
                var ld = semanticStack[1];

                //console.log(this.stack);
                // console.log("ID: ",id);
                // console.log("RCB: ",rcb);
                // console.log("LD: ",ld);
                
                if(id.type === ld.type) {
                    //console.log("L ",id.lex + rcb.type + ld.lex);
                    this.output['code'].push(rcb.lex + '=' + ld.lex + ';');
                }

                break;

            case '20': //'20': {'LD':    ['OPRD', 'opm', 'OPRD']},

                var semanticStack : any[] = [];
                for (let i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                }
                semanticStack.push(this.stack.pop());

                //semanticStack.push(this.stack.pop());
                console.log(semanticStack);
                var oprd1 = semanticStack[0];
                var opm = semanticStack[1];
                var oprd2 = semanticStack[2];

                var varAux = semanticStack[3];

                // console.log("OPRD1: ",oprd1);
                // console.log("OPM: ",opm);
                // console.log("OPRD2: ",oprd2);
                this.stack.push(semanticStack.pop());
                if (oprd1.type == oprd2.type && oprd1.type != 'literal') {
                    var temp = this.varTemp(opm.type);
                    var atr = temp + ' = ' + varAux.lex + oprd2.lex + opm.lex + ';';
                    this.output['code'].push(atr);
                    this.stack.push({
                        'lex': temp,
                        'type': oprd1.type
                    });
                }
                //console.log(this.stack);
                //this.stack.push(semanticStack.pop());
                break;

            case '21': //'21': {'LD':    ['OPRD']}

                var semanticStack : any[] = [];

                for (let i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                }
                
                this.stack.push(semanticStack[0]);

                break;

            case '22': //'22': {'OPRD':  ['id']}

                var semanticStack : any[] = [];

                for (let i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                } 
                
                //console.log(semanticStack[0]);
                this.stack.push(semanticStack[0]);
    
                break;

            case '23': //'23': {'OPRD':  ['num']}

                var semanticStack : any[] = [];

                for (let i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                }
                
                //console.log(semanticStack);
                this.stack.push(semanticStack[0]);

                break;

            case '25': //'25': {'COND':  ['CAB', 'CP']}

                break;

            case '26': //'26': {'CAB':   ['se', 'ab_p', 'EXP_R', 'fc_p', 'entao']}

                break;

            case '27': //'27': {'EXP_R': ['OPRD', 'opr', 'OPRD']},

                var semanticStack : any[] = [];
                for (var i = 0; i < ruleLength; i++) {
                    semanticStack.push(this.stack.pop());
                }
                semanticStack.push(this.stack.pop());

                var oprd1 = semanticStack[2];
                var opr = semanticStack[1];
                var oprd2 = semanticStack[3];

                //console.log(semanticStack);
                // console.log("OPRD1: ",oprd1);
                // console.log("OPR: ",opr);
                // console.log("OPRD2: ",oprd2);

                if (((opr.type == 'int' || opr.type == 'double') && (opr.type == 'int' || opr.type == 'double')) 
                        || (opr.type == opr.type && (oprd1.lex == '=' || oprd1.lex == '<>'))) {
        
                    var temp = this.varTemp('int')
                    var expr = temp + '=' + oprd2.lex + oprd1.lex + opr.lex + ';'
                    this.output['code'].push(expr)
        
                    this.stack.push({
                        'lex': temp,
                        'type': 'int'
                    });
                }

                this.stack.push(semanticStack.pop());
                break;
        }
    }
}

//function debug
function d(message: any) {
    console.log(message);
}

function dv(message: string, value: any) {
    console.log(message+value);
}

function ds(stack: any[])
{
    stack.forEach((item, index) => {
        console.log(`Index ${index}:`, item);
    });
}

function setType(lex: string,type: string | null) {

    for (let i = 0; i < symbolsTable.length; i++) {
        if (symbolsTable[i].lex === lex)
        {
            symbolsTable[i].type = type;
            break;
        }
    }
}
