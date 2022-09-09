import { AlphabetsHandler, Alphabet_Map } from "../AlphabetsHandler";
import { errorCodes } from "../AlphabetsHandler";

export const RailFenceEncipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, row: number = 1, input: string[],): string | number =>
{
    if (row <= 0)   return errorCodes.EINVAL;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    if (typeof CharacterMap == "number" && !CharacterMap)   return errorCodes.EXIT_FAILURE;
    let fence: string[][] = [];
    for (let i = 0; i < row; i++)   fence.push([]);
    let rail: number = 0;
    let direction: number = 1;
    for (let index in input)
    {
        if (CharacterMap[index].key > -1) {
            fence[rail].push(input[index]);
            rail += direction;
            if (rail === row -1 || rail === 0)  direction = -direction;
        }
    }
    let tempCipher: string = '';
    for (let rail of fence) tempCipher += rail.join('');
    let cipher: string[] = tempCipher.split('');
    input.forEach((character, index) => {
        if (CharacterMap[index].key == -1)
            cipher.splice(index, 0, input[index]);
    });
    return cipher.join('');
}

export const RailFenceDecipher: Function = (alphabetsHandler: AlphabetsHandler, key: string, row: number = 1, input: string[]): string | number =>
{
    if (row <= 0)   return errorCodes.EINVAL;
    const CharacterMap: any = alphabetsHandler.validateCharacters(key, input);
    let CipherCharacterMap: string[] = input.filter((character, index) => {
        return CharacterMap[index].key > -1;
    });

    let fence: string[][] = [];
    for (let i = 0; i < row; i++)   fence.push([]);
    let rail: number = 0;
    let direction: number = 1;
    for (let index in input)
    {
        if (CharacterMap[index].key > -1) {
            fence[rail].push(input[index]);
            rail += direction;
            if (rail === row -1 || rail === 0)  direction = -direction;
        }
    }
    let rFence: string[][] = [];
	for (let i = 0; i < row; i++)	rFence.push([]);
	let i: number = 0;
	for (let rail of fence) {
		for (let j = 0; j < rail.length; j++)	rFence[i].push(CipherCharacterMap.shift()!);
		i++;
	}
    let plain: string[] = [];
	rail = 0, direction = 1;
	CipherCharacterMap = input.filter((character, index) => { return CharacterMap[index].key > -1; });
	for (let i = 0; i < CipherCharacterMap.length; i++) {
		plain.push(rFence[rail].shift()!);
		rail += direction;
		if (rail === row - 1 || rail === 0) direction = -direction;
	}
    input.forEach((character, index) => {
        if (CharacterMap[index].key == -1)
            plain.splice(index, 0, input[index]);
    });
	return plain.join('');
}