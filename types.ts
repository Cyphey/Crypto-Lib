export const isalpha: Function = (character: string): boolean =>
{
    return (character.charCodeAt(0) >= 65 && character.charCodeAt(0) <= 90) || (character.charCodeAt(0) >= 97 && character.charCodeAt(0) <= 122);
}

export const isUpperCase: Function = (character: string) =>
{
    return character.charCodeAt(0) >= 65 && character.charCodeAt(0) <= 90;
}

export const isLowerCase: Function = (character: string): boolean =>
{
    return character.charCodeAt(0) >= 97 && character.charCodeAt(0) <= 122;
}