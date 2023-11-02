import {Token} from "../lexicon/token";

export class DFA {
    public state: number;
    public lex: string;

    constructor() {
        this.state = 0;
        this.lex = '';
    }

    public *recognize(input: string): Generator<Token>  {
        let float: number = 0
        for (let i = 0; i < input.length; i++) {
            switch (this.state) {
                case 0:
                    if (input[i] === ' ' || input[i] === '\t' || input[i] === '\n' || input[i] === '\r') {
                        this.state = 0;
                    } else if (input[i] >= '0' && input[i] <= '9')  {
                        this.state = 1;
                        this.lex = input[i];
                    } else if ((input[i] >= 'a' && input[i] <= 'z') || (input[i] >= 'A' && input[i] <= 'Z')) {
                        this.lex = input[i]
                        this.state = 22
                    } else if (input[i] === '{') //feito
                    {
                        this.state = 25
                        this.lex = input[i]
                    } else if (input[i] === '<') {
                        this.state = 9;
                        this.lex = input[i];
                    } else if (input[i] === '=') {
                        this.state = 13;
                        this.lex = input[i];
                    } else if (input[i] === '>') {
                        this.state = 14;
                        this.lex = input[i];
                    } else if (input[i] === '+' || input[i] === '-' || input[i] === '*' || input[i] === '/') {
                        this.lex = input[i];
                        this.state = 15;
                    } else if (input[i] === ';') //feito
                    {
                        this.state = 18
                        this.lex = input[i]
                    } else if (input[i] === ',') //feito
                    {
                        this.state = 17
                        this.lex = input[i]
                    } else if (input[i] === '"') //feito
                    {
                        this.state = 19
                        this.lex = input[i]
                    } else if (input[i] === '(') //feito
                    {
                        this.state = 24
                        this.lex = input[i]
                    } else if (input[i] === ')') //feito
                    {
                        this.state = 23
                        this.lex = input[i]
                    } else if (input[i] === '$') {
                        break
                    } else {
                        this.lex = input[i]
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        ////console.log('ERROR léxico - Caractere inválido na linguagem. Linha ${linha}, coluna ${coluna}.`)
                        this.state = 0
                        this.lex = ""
                        //i--
                    }
                    break;

                case 1:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 7;
                        this.lex += input[i];
                    } else if (input[i] === '.') {
                        float = 1;
                        this.state = 2;
                        this.lex += input[i];
                    } else if (input[i] === 'E' || input[i] === 'e') {
                        this.state = 4;
                        this.lex += input[i];
                    } else {
                        yield {class: "NUM", lex: this.lex, type: "inteiro"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 2:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 3;
                        this.lex += input[i];
                    } else {
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 3:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 3;
                        this.lex += input[i];
                    } else if (input[i] === 'E' || input[i] === 'e') {
                        this.state = 4;
                        this.lex += input[i];
                    } else {
                        if (float === 1) {
                            yield {class: "NUM", lex: this.lex, type: "float"}
                        } else {
                            yield {class: "NUM", lex: this.lex, type: "inteiro"}
                        }
                        float = 0;
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 4:
                    if (input[i] === '+' || input[i] === '-') {
                        this.state = 5;
                        this.lex += input[i];
                    } else {
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--
                    }
                    break;

                case 5:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 6;
                        this.lex += input[i];
                    } else {
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 6:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 6;
                        this.lex += input[i];
                    } else {
                        if (float === 1) {
                            yield {class: "NUM", lex: this.lex, type: "float"}
                        } else {
                            yield {class: "NUM", lex: this.lex, type: "inteiro"}
                        }
                        this.state = 0;
                        this.lex = '';
                        float = 0;
                        i--;
                    }
                    break;

                case 7:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 7;
                        this.lex += input[i];
                    } else if (input[i] === '.') {
                        float = 1;
                        this.state = 8;
                        this.lex += input[i];
                    } else {
                        yield {class: "NUM", lex: this.lex, type: "inteiro"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 8:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 6;
                        this.lex += input[i];
                    }
                    else {
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 9:
                    if (input[i] === '>') {
                        this.state = 10;
                        this.lex += input[i];
                    } else if (input[i] === '=') {
                        this.state = 12;
                        this.lex += input[i];
                    } else if (input[i] === '-') {
                        this.state = 11;
                        this.lex += input[i];
                    } else {
                        yield {class: "Operador relacional", lex: this.lex, type: "OPR"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 10:
                    yield {class: "Operador relacional", lex: this.lex, type: "OPR"}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 11:
                    yield {class: "Atribuição", lex: this.lex, type: "RCB"}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 12:
                    yield {class: "Operador relacional", lex: this.lex, type: "OPR"}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 13:
                    yield {class: "Operador relacional", lex: this.lex, type: "OPR"}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 14:
                    if (input[i] === '=') {
                        this.state = 13;
                        this.lex += input[i];
                    } else {
                        yield {class: "Operador relacional", lex: this.lex, type: "OPR"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;

                case 15:
                    yield {class: "OPM", lex: this.lex, type: this.lex}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 17:
                    yield {class: "Virgula", lex: this.lex, type: this.lex}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 18:
                    yield {class: "PT_V", lex: this.lex, type: this.lex}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 19:
                    if (input[i] === '"') {
                        this.state = 21;
                        this.lex += input[i];
                    } else {
                        this.state = 20;
                        this.lex += input[i];
                    }
                    break;

                case 20:
                    if (input[i] === '"') {
                        this.state = 21;
                        this.lex += input[i];
                    } else if (input[i+1] === undefined) {
                        yield {class: "Constante literal", lex: this.lex, type: "Não fechou " + this.lex}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    } else {
                        this.state = 20;
                        this.lex += input[i];
                    }
                    break;

                case 21:
                    yield {class: "Constante literal", lex: this.lex, type: "Constante literal"}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    break;

                case 22:
                    if ((input[i] >= 'A' && input[i] <= 'Z') || (input[i] >= 'a' && input[i] <= 'z') || (input[i] >= '0' && input[i] <= '9') || (input[i] === '_')) {
                        this.state = 22;
                        this.lex += input[i];
                    } else {
                        yield {class: "id", lex: this.lex, type: "Identificador"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                    }
                    break;
            }
        }
        yield {class: 'EOF', lex: '$', type: null}
    }
}
