import {grammar} from "./grammar";
import {Token} from "../lexicon/token";

export class PDA {
    private readonly TRANSITION_TABLE_FILE_PATH = 'src/pda/states/ShiftReduce-Table.csv';
    private readonly csvConverter = require('convert-csv-to-json');
    private readonly transitionTable;
    private readonly grammar;

    private stack: string[];
    private isDone: boolean | undefined;
    private lexiconObject;
    private lexiconGenerator: Generator;

    constructor(lexiconGenerator: Generator) {
        this.transitionTable = this.csvConverter.fieldDelimiter(',').getJsonFromCsv(this.TRANSITION_TABLE_FILE_PATH);
        this.grammar = grammar;

        this.lexiconGenerator = lexiconGenerator;
        this.lexiconObject = lexiconGenerator.next();
        this.isDone = this.lexiconObject.done;
        this.stack = [];
    }

    private getToken(): Token {
        const token: Token = this.lexiconObject.value
        this.lexiconObject = this.lexiconGenerator.next();
        this.isDone = this.lexiconObject.done;
        return token;
    }

    private getCurrentState() {
        return this.stack[this.stack.length-1];
    }

    public parse(){
        let token: Token;
        this.stack.push('0');

        while (!this.isDone) {
            token = this.getToken();
            const state = this.getCurrentState();
            const hasAction = this.transitionTable[state][token.class];

            if (hasAction) {
                const action = this.transitionTable[state][token.class][0];
                const routine = this.transitionTable[state][token.class].substring(1);

                if (action === 's') {

                } else if (action === 'r') {

                } else if (action === 'a') {

                } else {

                }
            }
        }
    }
}
