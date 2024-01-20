import {Token} from "../lexicon/token";

const fs = require('fs');
fs.writeFileSync('programa.c','');

const body = {
    header: [
    '#include<stdio.h>',
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

    ],
    end: [
        '',
        '}'
    ]
}

export class semantic {

    private count;
    private lexiconObject;
    private lexiconGenerator: Generator;
    public semanticStack: any[];
    private output;

    constructor(lexiconGenerator: Generator) {

        this.count = 0;
        this.lexiconGenerator = lexiconGenerator;
        this.lexiconObject = lexiconGenerator.next();
        this.semanticStack = [];

        this.output = body;
    }

    semantic_construction () {

        
        for (let i = 0; i < this.output.header.length; i++) {
            fs.appendFileSync('programa.c', this.output.header[i]);
            fs.appendFileSync('programa.c', '\n');
        }        

        for (let i = 0; i < this.output.tempVars.length; i++) {
            fs.appendFileSync('programa.c', this.output.tempVars[i]);
            fs.appendFileSync('programa.c', '\n');
        } 

        for (let i = 0; i < this.output.vars.length; i++) {
            fs.appendFileSync('programa.c', this.output.vars[i]);
            fs.appendFileSync('programa.c', '\n');
        } 

        for (let i = 0; i < this.output.code.length; i++) {
            fs.appendFileSync('programa.c', this.output.code[i]);
            fs.appendFileSync('programa.c', '\n');
        } 

        for (let i = 0; i < this.output.end.length; i++) {
            fs.appendFileSync('programa.c', this.output.end[i]);
            fs.appendFileSync('programa.c', '\n');
        }
        
        
    }

    rule () {

        this.output['vars'].push('');
        this.output['vars'].push('');
        this.output['vars'].push('');

    }
}