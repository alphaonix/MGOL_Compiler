import {loadKeywordSymbols, printSymbolsTable} from "./lexicon/symbols";
import {syntax} from "./syntax/syntax";

function main() {
    loadKeywordSymbols();
    syntax();
    printSymbolsTable();
}

main();
