import {loadKeywordSymbols, printSymbolsTable} from "./lexicon/symbols";
import {lexicon} from "./lexicon/lexicon";
import {Token} from "./lexicon/token";

function main() {
    loadKeywordSymbols();

    const lexiconGenerator = lexicon();
    let lexiconObject = lexiconGenerator.next();

    while (!lexiconObject.done) {
        const token: Token = lexiconObject.value
        console.log(token);
        lexiconObject = lexiconGenerator.next();
    }

    printSymbolsTable();
}

main();
