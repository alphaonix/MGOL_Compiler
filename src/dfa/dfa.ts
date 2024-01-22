import {Token} from "../lexicon/token";
import {isKeyword} from "../lexicon/symbols";
import {Error} from "../error/error";

export class DFA {
    public state: number;
    public lex: string;

    constructor() {
        Error.line = 0
        Error.column = 0;
        this.state = 0;
        this.lex = '';
    }

    public *recognize(input: string): Generator<Token>  {
        Error.line = 1;

        let float: number = 0
        for (let i = 0; i < input.length; i++) {

            if (input[i] === '\n'){
                Error.line++;
                Error.column = -1;
            }
            Error.column++;

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
                    } else if (input[i] === '{') {
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
                    } else if (input[i] === ';') {
                        this.state = 18;
                        this.lex = input[i];
                    } else if (input[i] === ',') {
                        this.state = 17;
                        this.lex = input[i];
                    } else if (input[i] === '"') {
                        this.state = 19;
                        this.lex = input[i];
                    } else if (input[i] === '(') {
                        this.state = 24;
                        this.lex = input[i];
                    } else if (input[i] === ')') {
                        this.state = 23;
                        this.lex = input[i];
                    } else if (input[i] === '$') {
                        break;
                    } else {
                        this.lex = input[i];
                        Error.lexError(1, Error.line, Error.column);
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
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
                        yield {class: 'NUM', lex: this.lex, type: 'int'}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
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
                        Error.column--;
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
                        yield {class: 'NUM', lex: this.lex, type: (float === 1) ? 'double' : 'int'}
                        float = 0;
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    }
                    break;

                case 4:
                    if (input[i] === '+' || input[i] === '-') {
                        this.state = 5;
                        this.lex += input[i];
                    }
                    else if (input[i] >= '0' && input[i] <= '9')
                    {
                        this.state = 6;
                        this.lex += input[i];
                    }
                    else {
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
                        Error.column--;
                    }
                    break;

                case 6:
                    if (input[i] >= '0' && input[i] <= '9') {
                        this.state = 6;
                        this.lex += input[i];
                    } else {
                        yield {class: 'NUM', lex: this.lex, type: (float === 1) ? 'double' : 'int'}
                        this.state = 0;
                        this.lex = '';
                        float = 0;
                        i--;
                        Error.column--;
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
                        yield {class: 'NUM', lex: this.lex, type: "int"}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
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
                        Error.column--;
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
                        yield {class: 'OPR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    }
                    break;

                case 10:
                    yield {class: 'OPR', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 11:
                    yield {class: 'RCB', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 12:
                    yield {class: 'OPR', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 13:
                    yield {class: 'OPR', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 14:
                    if (input[i] === '=') {
                        this.state = 13;
                        this.lex += input[i];
                    } else {
                        yield {class: 'OPR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    }
                    break;

                case 15:
                    yield {class: 'OPM', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 17:
                    yield {class: 'VIR', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 18:
                    yield {class: 'PT_V', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
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
                        Error.lexError(2, Error.line, Error.column);
                        yield {class: 'LIT', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    } else {
                        this.state = 20;
                        this.lex += input[i];
                    }
                    break;

                case 21:
                    yield {class: 'LIT', lex: this.lex, type: 'literal'}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 22:
                    if ((input[i] >= 'A' && input[i] <= 'Z') || (input[i] >= 'a' && input[i] <= 'z') || (input[i] >= '0' && input[i] <= '9') || (input[i] === '_')) {
                        this.state = 22;
                        this.lex += input[i];
                    } else {
                        yield {
                            class: isKeyword(this.lex) ? this.lex : 'ID',
                            lex: this.lex,
                            type: isKeyword(this.lex) ? this.lex : null
                        }
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    }
                    break;

                case 23:
                    yield {class: 'FC_P', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 24:
                    yield {class: 'AB_P', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;

                case 25:
                    if (input[i] === '}') {
                        this.state = 27;
                        this.lex += input[i];
                    } else {
                        this.state = 26;
                        this.lex += input[i];
                    }
                    break;

                case 26:
                    if (input[i] === '}') {
                        this.state = 27;
                        this.lex += input[i];
                    } else if (input[i+1] === undefined) {
                        Error.lexError(3, Error.line, Error.column);
                        yield {class: 'ERROR', lex: this.lex, type: null}
                        this.state = 0;
                        this.lex = '';
                        i--;
                        Error.column--;
                    } else {
                        this.state = 26;
                        this.lex += input[i];
                    }
                    break;

                case 27:
                    yield {class: 'COMENTARIO', lex: this.lex, type: null}
                    this.state = 0;
                    this.lex = '';
                    i--;
                    Error.column--;
                    break;
            }
        }
        yield {class: 'EOF', lex: '$', type: null}
    }
}
