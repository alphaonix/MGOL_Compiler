import {lexicon} from "../lexicon/lexicon";
import {PDA} from "../pda/pda";

export function syntax() {
    const lexiconGenerator = lexicon();
    const pda = new PDA(lexiconGenerator);
    pda.parse();
}
