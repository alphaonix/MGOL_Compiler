export class Error {
    public static line: number;
    public static column: number;

    constructor() {}

    public static lexError(code: number, line: number, column: number) {
        switch (code) {
            case 1:
                console.log(`ERRO LÉXICO - Caractere inválido na linguagem, linha ${line}, coluna ${column}`);
                break;
            case 2:
                console.log(`ERRO LÉXICO - O literal nunca termina, linha ${line}, coluna ${column}`);
                break;
            case 3:
                console.log(`ERRO LÉXICO - O comentário nunca termina, linha ${line}, coluna ${column}`);
                break;
            default:
                console.log(`ERRO LÉXICO - Erro desconhecido na linha ${line}, coluna ${column}`);
                break;
        }
    }
}
