import * as fs from "fs";
import {DFA} from "../dfa/dfa";
import {Token} from "./token";

export function* scanner(file: string): Generator<Token> {
    const algFile = fs.readFileSync(file);
    const algStr = algFile.toString();

    const dfa = new DFA();
    console.log('Start reading file')
    for (let i = 0; i < algStr.length; i++) {
        // setup error
        //console.log('Error: unknown character \'' + algStr[i] + '\' code ' + characterCode);
        const token = dfa.recognize(algStr[i]);
        if (token !== undefined) {
            yield token;
        }
    }
}
