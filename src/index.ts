import {loadKeywordSymbols, printSymbolsTable} from "./lexicon/symbols";
import {lexicon} from "./lexicon/lexicon";
import {Token} from "./lexicon/token";

console.log('Service running');
loadKeywordSymbols();
const x = lexicon();
let word = x.next();
while (!word.done) {
    const token: Token = word.value
    console.log(token);
    word = x.next();
}
printSymbolsTable();
