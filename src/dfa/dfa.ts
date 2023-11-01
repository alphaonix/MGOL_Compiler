import {Token} from "../lexicon/token";

export class DFA {
    public initialState: number;
    public currentState: number;
    public lex: string;

    constructor(
    ) {
        this.initialState = 0;
        this.currentState = 0;
        this.lex = '';
    }

    public recognize(char: string): Token | undefined {
        switch (this.currentState) {
            case 0:
                if (char === ' ' || char === '\t' || char === '\n') {
                    this.currentState = 0
                } else if (char >= '0' && char <= '9') {
                    this.currentState = 1
                    this.lex = char
                } else if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
                    this.currentState = 22
                } else if (char === '{') {
                    this.currentState = 25
                    this.lex = char
                } else if (char === '<') {
                    this.currentState = 9
                    this.lex = char
                } else if (char === '=') {
                    this.currentState = 13
                } else if (char === '>') {
                    this.currentState = 14
                } else if (char === '+' || char === '-' || char === '*' || char === '/') {
                    this.lex = char
                    this.currentState = 18
                } else if (char === ';') {
                    this.currentState = 18
                } else if (char === ',') {
                    this.currentState = 17
                } else if (char === '"') {
                    this.currentState = 19
                } else if (char === '(') {
                    this.currentState = 24
                    this.lex = char
                } else if (char === ')') {
                    this.currentState = 23
                    this.lex = char
                } else {
                    this.lex = char
                    const token: Token = {class: 'ERROR', lex: char, type: null}
                    this.currentState = 0
                    this.lex = ''
                    return token;
                }
                break
        }
        return
    }
}
