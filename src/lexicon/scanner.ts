import * as fs from "fs";
import {DFA} from "../dfa/dfa";
import {Token} from "./token";
import {Error} from "../error/error";

export function* scanner(file: string): Generator<Token> {
    const algFile = fs.readFileSync(file);
    const algStr = algFile.toString();

    const errorRoutine = new Error();
    const dfa = new DFA(errorRoutine);

    const tokenGenerator = dfa.recognize(algStr.concat('$'));
    let tokenObject = tokenGenerator.next();
    while (!tokenObject.done) {
        yield tokenObject.value;
        tokenObject = tokenGenerator.next();
    }
}
