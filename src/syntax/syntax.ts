import {lexicon} from "../lexicon/lexicon";
import {Token} from "../lexicon/token";

export function syntax() {
    const lexiconGenerator = lexicon();
    let lexiconObject = lexiconGenerator.next();

    while (!lexiconObject.done) {
        const token: Token = lexiconObject.value
        console.log(token);
        lexiconObject = lexiconGenerator.next();
    }
}
