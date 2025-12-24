export const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function buildSearchRegex(
    query: string,
    caseSensitive = false,
    wholeWord = false
): RegExp | null {
    if (!query) return null;

    const escaped = escapeRegExp(query);
    let pattern = escaped;

    if (wholeWord) {
        pattern = `(?<![\\p{L}\\p{N}_])${pattern}(?![\\p{L}\\p{N}_])`;
    }

    const flags = caseSensitive ? 'u' : 'iu';
    try {
        return new RegExp(`(${pattern})`, flags);
    } catch (e) {
        if (wholeWord) {
            const asciiPattern = `\\b${escaped}\\b`;
            return new RegExp(`(${asciiPattern})`, flags);
        }
        throw e;
    }
}
