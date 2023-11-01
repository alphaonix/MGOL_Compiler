import {Token} from "../lexicon/token";

export class DFA {
    public alphabet: Set<string>;
    public states: number[];
    public initialState: number;
    public acceptingStates: Set<string>;
    public currentState: number;
    public lex: string;

    constructor(
    ) {
        const digits = Array.from(Array(10)).map((e, i) => i + 48).map((x) => String.fromCharCode(x));
        const upper = Array.from(Array(26)).map((e, i) => i + 65).map((x) => String.fromCharCode(x));
        const lower = Array.from(Array(26)).map((e, i) => i + 97).map((x) => String.fromCharCode(x));
        const specialCharacters = [',', ';', ':', '.', '!', '?', '\\', '*', '+', '-', '/', '(', ')', '{', '}', '[', ']', '<', '>', '=', '\'', '\"', '_'];
        this.alphabet = new Set(digits.concat(upper, lower, specialCharacters));
        this.states = Array.from(Array(25));
        this.initialState = 0;
        this.currentState = 0;
        this.lex = '';
        this.acceptingStates = new Set(["1", "2", "4", "7", "9", "10", "11", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]);
    }

    public isValidChar(charCode: number): boolean {
        const charSymbol = String.fromCharCode(charCode);
        if (charCode === 32 || charCode === 13 || charCode === 10) {
            return true;
        }
        return this.alphabet.has(charSymbol);
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
