import * as fs from "fs";
import {DFA} from "../dfa/dfa";
import {Token} from "./token";

export function* scanner(file: string) {
    const algFile = fs.readFileSync(file);
    const algStr = algFile.toString();

    console.log('Start reading file')
    for (let i = 0; i < algStr.length; i++) {
        const characterCode = algStr.charCodeAt(i);
        const dfa = new DFA();
        // setup error
        //console.log('Error: unknown character \'' + algStr[i] + '\' code ' + characterCode);
        yield dfa.recognize(algStr[i])
    }
}
