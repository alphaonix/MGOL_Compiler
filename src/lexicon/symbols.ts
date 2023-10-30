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
