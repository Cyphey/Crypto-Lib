import { errorCodes } from "./errno";

export {errorCodes} from "./errno";

export interface Alphabet_Map
{
	key: number,
	index: number
};

export class AlphabetsHandler
{
    public alphabets: Map<string, Map<number, string[]>> = new Map();

    constructor()
    {
        // Add the English Alphabet
        this.alphabets.set("EnglishAlphabet", new Map<number, string[]>([
            [0, ['A', 'a']],
            [1, ['B', 'b']],
            [2, ['C', 'c']],
            [3, ['D', 'd']],
            [4, ['E', 'e']],
            [5, ['F', 'f']],
            [6, ['G', 'g']],
            [7, ['H', 'h']],
            [8, ['I', 'i']],
            [9, ['J', 'j']],
            [10, ['K', 'k']],
            [11, ['L', 'l']],
            [12, ['M', 'm']],
            [13, ['N', 'n']],
            [14, ['O', 'o']],
            [15, ['P', 'p']],
            [16, ['Q', 'q']],
            [17, ['R', 'r']],
            [18, ['S', 's']],
            [19, ['T', 't']],
            [20, ['U', 'u']],
            [21, ['V', 'v']],
            [22, ['W', 'w']],
            [23, ['X', 'x']],
            [24, ['Y', 'y']],
            [25, ['Z', 'z']]
        ]));
    }

    hasAlphabet(key: string): boolean {
		return this.alphabets.has(key);
	}

    addAlphabet(alphabetIdentifier: string, alphabet: Map<number, any[]>): number {
        this.alphabets.set(alphabetIdentifier, alphabet);
        if (!this.alphabets.has(alphabetIdentifier))
            return errorCodes.EXIT_FAILURE;
        return errorCodes.EXIT_SUCCESS;
    }

    validateCharacters(key: string, input: any[]): Alphabet_Map[] | number
    {
        if (!this.hasAlphabet(key))
            return errorCodes.EINVAL;

        const alphabet: Map<number, any[]> = this.alphabets.get(key)!;
        const CharacterMap: Alphabet_Map[] = [];
        input.forEach((character, index) => {
            let keyIndex: number = -1, valueIndex = 0;
            for (let [key, values] of alphabet)
            {
                values.forEach((value, value_index) => {
                    if (character === value)    {keyIndex = key; valueIndex = value_index;}
                    CharacterMap[index] = { key: keyIndex, index: valueIndex };
                });
            }
        });
        return CharacterMap;
    }

    findMissingValidCharacters(key: string, input: any[]): Alphabet_Map[] | number {
        if (!this.hasAlphabet(key))
            return errorCodes.EINVAL;

        // Copy the alphabet map into a new alphabet
        const alphabetCopy: Map<number, any[]> = new Map(this.alphabets.get(key))!;
        const CharacterMap: any = this.validateCharacters(key, input);
        (<Alphabet_Map[]>CharacterMap).forEach(entry => {
            if (entry.key > -1 && alphabetCopy.has(entry.key))
                alphabetCopy.delete(entry.key)
        });

        const MissingAlphabetCharacterMap: Alphabet_Map[] = [];
        let index = 0;
        for (let [key, values] of alphabetCopy) {
            MissingAlphabetCharacterMap[index] = {key: key, index: 0};
            index++;
        }
        return MissingAlphabetCharacterMap;
    }
}