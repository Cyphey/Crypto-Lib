import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../errno";

export const ColumnarTranspositionEncipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, keyKeyWord: string, keyword: string[], padding: string, input: string[]): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key) || !alphabetsHandler.hasAlphabet(keyKeyWord))
        return errorCodes.EINVAL;

    const PlainCharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    let KeyWordCharacterMap: any = alphabetsHandler.validateCharacters(keyKeyWord, keyword);
    let INDEX = 0;
    (<Alphabet_Map[]>KeyWordCharacterMap).forEach((entry, index) => {
        if (entry.key > -1) entry.index = INDEX++;
    });
    const inputKeyWord: string[] = keyword.filter((character, index) => {
        return KeyWordCharacterMap[index].key > -1;
    });
    const inputPlain: string[] = input.filter((character, index) => {
        return PlainCharacterMap[index].key > -1;
    });

    let KeywordArray: string[][] = [];
    for (let i = 0; i < inputKeyWord.length; i++)    KeywordArray.push([]);
    inputPlain.forEach((character, index) => KeywordArray[index % inputKeyWord.length].push(character));
    KeywordArray.forEach((value, index) => {
        if (value.length != KeywordArray[0].length)
            value.push(padding);
    });
    KeyWordCharacterMap = (<Alphabet_Map[]>KeyWordCharacterMap).sort((a, b) => {return a.key - b.key});
    let OrderedKeyWordArray: string[][] = [];   INDEX = 0;
    (<Alphabet_Map[]>KeyWordCharacterMap).forEach(entry => {
        if (entry.key > -1) OrderedKeyWordArray[INDEX++] = KeywordArray[entry.index];
    });

    let cipher: string[] = [];
    OrderedKeyWordArray.forEach(row => {
        cipher.splice(row.length, 0, row.join(''));
    });
    return cipher.join('');
}

export const ColumnarTranspositionDecipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, keyKeyWord: string, keyword: string[], input: string[]): string | number =>
{
    if (!alphabetsHandler.hasAlphabet(key) || !alphabetsHandler.hasAlphabet(keyKeyWord))
        return errorCodes.EINVAL;
    const PlainCharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    const KeyWordCharacterMap: any = alphabetsHandler.validateCharacters(keyKeyWord, keyword);
    const inputCipher: string[] = input.filter((character, index) => {
        return PlainCharacterMap[index].key > -1;
    });

    let KeyWordValues: number[] = [], counter = 0;
    (<Alphabet_Map[]>KeyWordCharacterMap).forEach(entry => KeyWordValues.push(entry.key));
    let OrderedKeyWordValues: number[]= [];
    let min = Math.min(...KeyWordValues);
    while (counter < KeyWordValues.length)
    {
        let MinIndex = -1;
        while ((MinIndex = KeyWordValues.indexOf(min)) === -1)  min++;

        if (MinIndex > -1)
        {
            OrderedKeyWordValues[MinIndex] = counter++;
            let duplicate = KeyWordValues.indexOf(min, MinIndex + 1);
            while (duplicate != -1)
            {
                OrderedKeyWordValues[duplicate] = counter++;
                duplicate = KeyWordValues.indexOf(min, duplicate + 1);
            }
        }
        min++;
    }

    let OrderedKeyWordPlainValues: Map<number, string[]> = new Map();
    const blankSpaces = (OrderedKeyWordValues.length - (inputCipher.length % OrderedKeyWordValues.length)) % OrderedKeyWordValues.length;
    OrderedKeyWordValues.forEach((entry, index) => OrderedKeyWordPlainValues.set(entry, []));
    for (let i = 0; i < Math.ceil(inputCipher.length / OrderedKeyWordValues.length);  i++)
    {
        console.log(i);
        let columnValue = i.valueOf();
        let columnIndex: number = OrderedKeyWordValues.indexOf(i);
        for (let n = 0; n < (i < OrderedKeyWordValues.length - 1 ? OrderedKeyWordValues.length : !blankSpaces ? OrderedKeyWordValues.length : inputCipher.length % OrderedKeyWordValues.length); n++)
        {
            while ((columnIndex >= OrderedKeyWordValues.length - blankSpaces && OrderedKeyWordPlainValues.get(columnValue)?.length === Math.ceil(inputCipher.length / OrderedKeyWordValues.length) - 1) || (columnIndex < OrderedKeyWordValues.length - blankSpaces && OrderedKeyWordPlainValues.get(columnValue)?.length === Math.ceil(inputCipher.length / OrderedKeyWordValues.length))) {
                columnValue++;
                columnIndex = OrderedKeyWordValues.indexOf(columnValue);
            }
            OrderedKeyWordPlainValues.get(columnValue)?.push(inputCipher[i * OrderedKeyWordValues.length + n]);
        }
    }

    let plain: string = '';
    let parts: string[][] = [];
    for (let [key, value] of OrderedKeyWordPlainValues) parts.push(value);
    while (parts[0].length) plain += parts.reduce((out,part)=>out+(part.shift()||''), '');
    return plain;
}