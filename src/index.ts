import {loadKeywordSymbols, printSymbolsTable} from "./lexicon/symbols";
import {lexicon} from "./lexicon/lexicon";

console.log('Service running');
loadKeywordSymbols();
const x = lexicon();
let word = x.next();
while (!word.done) {
    console.log(word.value);
    word = x.next();
}
