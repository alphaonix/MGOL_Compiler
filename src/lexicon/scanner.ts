import * as fs from "fs";
import {DFA} from "../dfa/dfa";
import {Token} from "./token";
import {lexicon} from "./lexicon";

export function* scanner(file: string): Generator<Token> {
    const algFile = fs.readFileSync(file);
    const algStr = algFile.toString();

    console.log('Starting DFA')
    const dfa = new DFA();

    const wordGenerator = dfa.recognize(algStr.concat('$'))
    let word = wordGenerator.next();
    while (!word.done) {
        yield word.value;
        word = wordGenerator.next();
    }
}
