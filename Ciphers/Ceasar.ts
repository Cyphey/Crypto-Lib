import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../AlphabetsHandler";

export const CeasarEncipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, input: string[], offset: number): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    let cipher: string[] = [];
    (input).forEach((character, index) => {
        const code: Alphabet_Map = CharacterMap[index];
        cipher?.push(code.key > -1 ? alphabet.get((code.key + offset) % alphabet.size)?.[code.index]! : character);
    });
    return cipher.join('');
}

export const CeasarDecipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, input: string[], offset: number): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    const plain: string[] = [];
    input.forEach((character, index) => {
        const code = CharacterMap[index];
        plain.push(code.key > -1 ? alphabet.get(((code.key - offset) % alphabet.size + alphabet.size) % alphabet.size)?.[code.index]! : character);
    });
    return plain.join('');
}