import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../AlphabetsHandler";
import { egcd } from "../matlib";

export const AffineEncipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, alpha: number, beta: number, input: string[]): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    let cipher: string[] = [];
    input.forEach((character, index) => {
        const code = CharacterMap[index];
        // cipher.push((<Alphabet_Map>code).key > -1 ? alphabet.get((alpha * code.key + beta) % alphabet.size)?.[code.index]! : character);
        cipher.push((<Alphabet_Map>code).key > -1 ? alphabet.get((alpha * code.key + beta) % alphabet.size)?.[code.index]! : '');
    });
    return cipher.join('');
}

export const AffineDecipherKnownKey: Function = (alphabetsHandler: AlphabetsHandler, key: string, alpha: number, beta: number, input: string[]): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    const alphaMultiplicativeInverse: number = egcd(alpha, alphabet.size);
    let plain: string[] = [];
    input.forEach((character, index) => {
        const code = CharacterMap[index];
        // plain.push((<Alphabet_Map>code).key > -1 ? alphabet.get(((alphaMultiplicativeInverse * (code.key - beta)) % alphabet.size + alphabet.size) % alphabet.size)?.[code.index]! : character);
        plain.push((<Alphabet_Map>code).key > -1 ? alphabet.get(((alphaMultiplicativeInverse * (code.key - beta)) % alphabet.size + alphabet.size) % alphabet.size)?.[code.index]! : '');
    });
    return plain.join('');
}

export const AffineKnownPlainTextAttack: Function = (alphabetsHandler: AlphabetsHandler, key: string, inputPlain: string[], inputCipher: string[]): number[] | number =>
{
    if (!alphabetsHandler.hasAlphabet(key)) return errorCodes.EINVAL;
    const alphabet: Map<number, string[]> = alphabetsHandler.alphabets.get(key)!;

    const PlainCharacterMap: any = alphabetsHandler.validateCharacters(key, inputPlain);
    const Plain = inputPlain.filter((value, index) => {
        return PlainCharacterMap[index].key > -1;
    });

    const CipherCharacterMap: any = alphabetsHandler.validateCharacters(key, inputCipher);
    const Cipher = inputCipher.filter((value, index) => {
        return CipherCharacterMap[index].key > -1;
    });

    if (Plain.length < 2 || Cipher.length < 2)  return errorCodes.EINVAL;
    if ((PlainCharacterMap == "number" && !PlainCharacterMap) || (CipherCharacterMap == "number" && !CipherCharacterMap))
        return errorCodes.EXIT_FAILURE;

    const PlainAlphabetCode0: number = PlainCharacterMap[0].key,
          PlainAlphabetCode1: number = PlainCharacterMap[1].key,
          PlainAlphabetCodeDifference: number = ((PlainAlphabetCode0 - PlainAlphabetCode1) % alphabet.size + alphabet.size) % alphabet.size,
          CipherAlphabetCode0: number = CipherCharacterMap[0].key,
          CipherAlphabetCode1: number = CipherCharacterMap[1].key,
          CipherAlphabetCodeDifference: number = ((CipherAlphabetCode0 - CipherAlphabetCode1) % alphabet.size + alphabet.size) % alphabet.size,
          alpha: number = ((CipherAlphabetCodeDifference * egcd(PlainAlphabetCodeDifference, alphabet.size)) % alphabet.size + alphabet.size) % alphabet.size,
          beta: number = (CipherAlphabetCode0 - (alpha * PlainAlphabetCode0) % alphabet.size + alphabet.size) % alphabet.size;
    return [alpha, beta];
}