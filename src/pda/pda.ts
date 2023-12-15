import {Grammar, grammar} from "./grammar";
import {Token} from "../lexicon/token";
import {Error} from "../error/error";

export class PDA {
    private readonly TRANSITION_TABLE_FILE_PATH = 'src/pda/states/ShiftReduce-Table.csv';
    private readonly csvConverter = require('convert-csv-to-json');
    private readonly transitionTable;
    private readonly grammar: Grammar;

    private stack: string[];
    private lexiconObject;
    private lexiconGenerator: Generator;

    constructor(lexiconGenerator: Generator) {
        this.transitionTable = this.csvConverter.fieldDelimiter(',').getJsonFromCsv(this.TRANSITION_TABLE_FILE_PATH);
        this.grammar = grammar;

        this.lexiconGenerator = lexiconGenerator;
        this.lexiconObject = lexiconGenerator.next();
        this.stack = [];
    }

    private getToken(): Token {
        const token: Token = this.lexiconObject.value
        this.lexiconObject = this.lexiconGenerator.next();
        return token;
    }

    private getCurrentState() {
        return this.stack[this.stack.length-1];
    }

    private panicMode(token: Token): Token {
        const recoveryPoints = ['pt_v', 'EOF'];

         while (!recoveryPoints.includes(token?.class)) {
            token = this.getToken();
        }

        return token;
    }

    public parse(){
        let token: Token = this.getToken();
        this.stack.push('0');

        do {
            const state = this.getCurrentState();
            const instruction = this.transitionTable[state][token?.class.toLowerCase()]
            const action = instruction[0];
            const routine = instruction.substring(1);

            if (action === 's') {
                this.stack.push(routine);
                token = this.getToken();
            } else if (action === 'r') {
                const reduce = this.grammar[routine];
                const rule = Object.keys(reduce)[0];
                const ruleLength = reduce[rule].length;

                for (let i = 0; i < ruleLength; i++) {
                    this.stack.pop();
                }

                const goTo = this.transitionTable[this.getCurrentState()][rule];
                this.stack.push(goTo);

                console.log(rule + ' -> ' + reduce[rule]);
            } else if (action === 'a') {
                console.log('ACCEPT');
                return;
            } else {
                Error.syntaxError(token, routine, Error.line, (Error.column - token.lex.length))
                token = this.panicMode(token);
            }
        } while (!this.lexiconObject.done);
    }
}
