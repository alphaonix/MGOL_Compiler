import {Grammar, grammar} from "./grammar";
import {Token} from "../lexicon/token";
import {Error} from "../error/error";
import {Semantic} from "../semantic/semantic";

export class PDA {
    private readonly TRANSITION_TABLE_FILE_PATH = 'src/pda/states/ShiftReduce-Table.csv';
    private readonly csvConverter = require('convert-csv-to-json');
    private readonly transitionTable;
    private readonly grammar: Grammar;

    private stack: string[];
    private lexiconObject;
    private lexiconGenerator: Generator;
    private hasInsertion = false;
    private insertionToken: Token = {class: '',lex: '',type: ''};
    private lastToken: Token = {class: '',lex: '',type: ''};
    private hasErrors = false;
    private semantic;

    constructor(lexiconGenerator: Generator) {
        this.transitionTable = this.csvConverter.fieldDelimiter(',').getJsonFromCsv(this.TRANSITION_TABLE_FILE_PATH);
        this.grammar = grammar;

        this.lexiconGenerator = lexiconGenerator;
        this.lexiconObject = lexiconGenerator.next();
        this.stack = [];
        this.semantic = new Semantic();
    }

    private getToken(): Token {

        if (this.hasInsertion === true) {
            this.hasInsertion = false
            return this.lastToken;
        }
        else {
            const token: Token = this.lexiconObject.value;
            this.lexiconObject = this.lexiconGenerator.next();
            this.lastToken = token;
            return token;
        }
    }

    private getCurrentState() {
        return this.stack[this.stack.length-1];
    }

    public parse() {
        let token: Token = this.getToken();
        this.stack.push('0');

        do {
            const state = this.getCurrentState();
            const tokenClass = token.class.toLowerCase();
            const hasAction = this.transitionTable[state][tokenClass];

            if (hasAction) {
                const action = this.transitionTable[state][tokenClass][0];
                const routine = this.transitionTable[state][tokenClass].substring(1);

                if (action === 's') {
                    this.stack.push(routine);
                    token = this.getToken();
                    this.semantic.stack.push(token);
                }
                else if (action === 'r') {

                    const reduce = this.grammar[routine];
                    const rule = Object.keys(reduce)[0];
                    const ruleLength = reduce[rule].length;

                    for (let i = 0; i < ruleLength; i++) {
                        this.stack.pop();
                    }

                    this.semantic.rule(routine,ruleLength,token);

                    const goTo = this.transitionTable[this.getCurrentState()][rule];
                    this.stack.push(goTo);

                    //console.log(rule + ' -> ' + reduce[rule]);
                }
                else if (action === 'a') {
                    
                    if (this.hasErrors === false) {
                        console.log('ACCEPT');
                        this.semantic.body_construction();
                        console.log('programa.c created successfully');
                    }
                    else {
                        console.log('FAILED');
                        console.log('programa.c created unsuccessfully');
                    }
                    return;
                }
                else {
                    token = this.try_insertion(token, routine, Error.line, (Error.column - token.lex.length));
                }
            }
            else {
                const line = Error.line;
                const column = Error.column;
                token = this.panicMode(token, Error.line);
                console.log(`Token: "${token.lex}" linha: ${line-1} coluna: ${column}`);
            }

        } while (true);
    }

    private panicMode(token: Token, line: number) : Token {
        this.hasErrors = true;

        while (token?.class != 'EOF') {
            if (token?.class === 'PT_V') {
                break;
            }
            else {
                if (token?.class === 'varfim' || token?.class === 'fimrepita' || token?.class === 'fimse'  || token?.class === 'fim') {
                    for (let i = 0; i < 3; i++) {
                        this.stack.pop();
                    }
                    return token;
                }
            }
            token = this.getToken()
        }
        return token;
    }

    public try_insertion(token: Token, code: string, line: number, column: number) {
        switch (code) {
            case '0':
                this.hasInsertion = true;
                return this.insertionToken = {class: 'inicio',lex: 'inicio',type: 'inicio'};
            case '4':
                this.hasInsertion = true;
                return this.insertionToken = {class: 'varinicio',lex: 'varinicio',type: 'varinicio'};
        }
        return this.insertionToken;
    }
}