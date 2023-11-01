import {scanner} from "./scanner";

const SOURCE_FILE_PATH = 'input/fonte.alg';

export function* lexicon() {
    const wordGenerator = scanner(SOURCE_FILE_PATH);
    let word = wordGenerator.next();
    while (!word.done) {
        yield word.value;
        word = wordGenerator.next();
    }
}
