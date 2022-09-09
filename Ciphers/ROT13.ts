import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../AlphabetsHandler";

export const ROT13Encipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, input: string[]): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    let cipher: string[] = [];
    (input).forEach((character, index) => {
        const code: Alphabet_Map = CharacterMap[index];
        cipher.push(code.key > -1 ? alphabet.get((code.key + 13) % alphabet.size)?.[code.index]! : character);
    });
    return cipher.join('');
}