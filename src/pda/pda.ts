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

    public parse(){
        this.stack.push('0');
        let token: Token;

        while (!this.isDone) {
            token = this.getToken();
            console.log(token);
        }
    }
}
