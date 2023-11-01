import {scanner} from "./scanner";
import {Token} from "./token";

const SOURCE_FILE_PATH = 'input/fonte.alg';

export function* lexicon(): Generator<Token> {
    const wordGenerator = scanner(SOURCE_FILE_PATH);
    let word = wordGenerator.next();
    while (!word.done) {
        yield word.value;
        word = wordGenerator.next();
    }
}
