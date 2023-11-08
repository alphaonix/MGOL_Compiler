import {scanner} from "./scanner";
import {Token} from "./token";
import {isKeyword, isPresent, symbolsTable} from "./symbols";

const SOURCE_FILE_PATH = 'input/fonte.alg';

export function* lexicon(): Generator<Token> {
    const scannerGenerator = scanner(SOURCE_FILE_PATH);
    let scannerObject = scannerGenerator.next();

    while (!scannerObject.done) {
        const token: Token = scannerObject.value;
        if (token.class === 'ID' && !isKeyword(token.lex) && !isPresent(token.lex)) {
            symbolsTable.push(token);
        }
        yield token;
        scannerObject = scannerGenerator.next();
    }
}
