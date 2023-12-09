export class Error {
    public static line: number;
    public static column: number;

    constructor() {}

    public invalidCharacter(line: number, column: number) {
        console.log(`ERRO LÉXICO - Caractere inválido na linguagem, linha ${line}, coluna ${column}`)
    }

    public invalidLiteral(line: number, column: number) {
        console.log(`ERRO LÉXICO - O literal nunca termina, linha ${line}, coluna ${column}`);
    }

    public invalidComment(line: number, column: number) {
        console.log(`ERRO LÉXICO - O comentário nunca termina, linha ${line}, coluna ${column}`);
    }
}
