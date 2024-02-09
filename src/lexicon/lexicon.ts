import {scanner} from "./scanner";
import {Token} from "./token";
import {getTokenFromTable, isKeyword, isPresent, symbolsTable} from "./symbols";

const SOURCE_FILE_PATH = 'input/fonte.alg';

function isError(tokenClass: string): boolean {
    return tokenClass === 'ERROR';
}

export function* lexicon(): Generator<Token> {
    const scannerGenerator = scanner(SOURCE_FILE_PATH);
    let scannerObject = scannerGenerator.next();

    while (!scannerObject.done) {
        const token: Token = scannerObject.value;
        if (token.class === 'ID' && !isKeyword(token.lex) && !isPresent(token.lex)) {
            symbolsTable.push(token);
        }

        if (!isError(token.class)) {
            if (isPresent(token.lex)) {
                yield getTokenFromTable(token.lex) as Token;
            } else {
                yield token;
            }
        }

        scannerObject = scannerGenerator.next();
    }
}