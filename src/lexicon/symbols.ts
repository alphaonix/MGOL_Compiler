import {Token} from "./token";

const keywords = [
    'inicio',
    'varinicio',
    'varfim',
    'escreva',
    'leia',
    'se',
    'entao',
    'fimse',
    'repita',
    'fimrepita',
    'fim',
    'inteiro',
    'literal',
    'real',
]

export const symbolsTable: Token[] = [];

export function loadKeywordSymbols() {
    keywords.forEach((word) => {
        const token: Token = {
            class: word,
            lex: word,
            type: word
        }
        symbolsTable.push(token);
    })
}

export function isKeyword(word: string): boolean {
    for (const keyword of keywords) {
        if (word === keyword) return true;
    }
    return false;
}

export function isPresent(lex: string): boolean {
    for (const token of symbolsTable) {
        if (token.lex === lex) return true;
    }
    return false;
}

export function printSymbolsTable() {
    for (const token of symbolsTable) {
        console.log('Classe: ' + token.class +
                    ', Lexema: \'' + token.lex +
                    '\', Tipo: ' + token.type);
    }
}
