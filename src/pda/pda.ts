import {grammar} from "./grammar";

export class PDA {
    private TRANSITION_TABLE_FILE_PATH = 'src/pda/states/ShiftReduce-Table.csv';
    private csvConverter = require('convert-csv-to-json');

    private readonly transitionTable;
    private readonly grammar;

    constructor() {
        this.transitionTable = this.csvConverter.fieldDelimiter(',')
            .getJsonFromCsv(this.TRANSITION_TABLE_FILE_PATH);
        this.grammar = grammar;
    }
}
