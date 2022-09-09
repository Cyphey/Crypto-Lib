import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../AlphabetsHandler";
import { isSquare } from "../matlib";

const parsePolybiusKey: Function = (key: string): string[][] =>
{
    let MultiDimensionalArray: string[][] = [];

    let index: number = 0;
    let multipleValues: boolean = false;

    for (let value of key)
    {
        if (!multipleValues)
            MultiDimensionalArray.push([]);

        if (value === '[' && !multipleValues)       multipleValues = true;
        else if (value === ']' && multipleValues)   { multipleValues = false; index++; }
        else if (multipleValues)                    { MultiDimensionalArray[index].push(value); }
        else if (!multipleValues)                   { MultiDimensionalArray[index].push(value); index++; }
    }
    MultiDimensionalArray.splice(index, 1);
    return MultiDimensionalArray;
}

const validatePolybiusCharacterAlphabet: Function = (alphabetsHandler: AlphabetsHandler, alphabetKey: string, polybiusSquareKey: string[][]): Map<string, number> | number =>
{
    if (!alphabetsHandler.hasAlphabet(alphabetKey))
        return errorCodes.EINVAL;

    const alphabet : Map<number, any[]> = alphabetsHandler.alphabets.get(alphabetKey)!;
    let polybiusKeyMap: Map<string, number> = new Map();
    let invalidArguement: boolean = false;
    polybiusSquareKey.forEach((entry, index) => {
        entry.forEach((entry_value, entry_index) => {
            let keyIndex: boolean = false;
            for (let [key, values] of alphabet)
            {
                values.forEach(values_value => {
                    if (values_value === entry_value)   { polybiusKeyMap.set(entry_value, index); keyIndex = true;}
                });
            }
            if (!keyIndex)  invalidArguement = true;
        });
    });
    if (invalidArguement)   return errorCodes.EINVAL;
    return polybiusKeyMap;
}

export const PolybiusSquareEncipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, polybiusSquareKey: string, heading: string[], input: string[]) =>
{
    if (!alphabetsHandler.hasAlphabet(key))
        return errorCodes.EINVAL;
    const polybiusSquareArray: string[][] = parsePolybiusKey(polybiusSquareKey);
    if (!isSquare(polybiusSquareArray.length) || Math.pow(heading.length, 2) != polybiusSquareArray.length)
        return errorCodes.EINVAL;
    const polybiusSquareKeyMap: Map<string, number> | number = validatePolybiusCharacterAlphabet(alphabetsHandler, key, polybiusSquareArray);
    if (typeof polybiusSquareKeyMap === "number" && (<number>polybiusSquareKeyMap) > 0)   return errorCodes.EINVAL;

    let cipher: string[] = [];
    input.forEach((character, index) => {
        const headingArray: string[] = [heading[Math.floor((<Map<string, number>>polybiusSquareKeyMap).get(input[index])! / heading.length)], heading[Math.floor((<Map<string, number>>polybiusSquareKeyMap).get(input[index])! % heading.length)]];
        if ((<Map<string, number>>polybiusSquareKeyMap).has(character))
            cipher.push(...headingArray);
        else
            cipher.push(character);
    });
    return cipher.join('');
}

export const PolybiusSquareDecipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, polybiusSquareKey: string, heading: string[], input: string[]): string | number =>
{
     if (!alphabetsHandler.hasAlphabet(key))
        return errorCodes.EINVAL;
    const polybiusSquareArray: string[][] = parsePolybiusKey(polybiusSquareKey);
    if (!isSquare(polybiusSquareArray.length) || Math.pow(heading.length, 2) != polybiusSquareArray.length)
        return errorCodes.EINVAL;
    const squareRootLength = Math.sqrt(polybiusSquareArray.length);
    let headingMap: Map<string, number> = new Map();
    heading.forEach((character, index) => {
        headingMap.set(character, index);
    });
    const validPolybiusEncipheredCharacters: string[] = input.filter((value, index) => {
        return headingMap.has(value);
    });
    if (validPolybiusEncipheredCharacters.length % 2 != 0)   validPolybiusEncipheredCharacters.pop();
    let cipher: string[] = [];
    for (let i = 0; i < validPolybiusEncipheredCharacters.length / 2; i++)
    {
        const row = headingMap.get(validPolybiusEncipheredCharacters[i * 2]);
        const column = headingMap.get(validPolybiusEncipheredCharacters[i * 2 + 1]);
        if (row === undefined || column === undefined)    throw new Error("row || column === undefined");
        cipher.push(polybiusSquareArray[row * squareRootLength + column][0]);
    }
    return cipher.join('');
}