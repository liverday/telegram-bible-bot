/**
 * Remove acentos de strings
 * @param  {String} string acentuada
 * @return {String} string sem acento
 */

export default function normalize(text: string): string {
    return text
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
