import {lexicon} from "../lexicon/lexicon";
import {Token} from "../lexicon/token";
import {PDA} from "../pda/pda";

const lexiconGenerator = lexicon();
let lexiconObject = lexiconGenerator.next();

function getToken(): Token {
    const token: Token = lexiconObject.value
    lexiconObject = lexiconGenerator.next();
    return token;
}

export function syntax() {
    const pda = new PDA();

    while (!lexiconObject.done) {
        console.log(getToken());
    }
}
