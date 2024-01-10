import {loadKeywordSymbols} from "./lexicon/symbols";
import {syntax} from "./syntax/syntax";

function main() {
    loadKeywordSymbols();
    syntax();
}

main();
