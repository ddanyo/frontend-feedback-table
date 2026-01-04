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
        if (/^[\p{L}\p{N}_]/u.test(query)) {
            pattern = `(?<![\\p{L}\\p{N}_])${pattern}`;
        }

        if (/[\p{L}\p{N}_]$/u.test(query)) {
            pattern = `${pattern}(?![\\p{L}\\p{N}_])`;
        }
    }

    const flags = caseSensitive ? 'u' : 'iu';
    try {
        return new RegExp(`(${pattern})`, flags);
    } catch (e) {
        if (wholeWord) {
            return new RegExp(`(\\b${escaped}\\b)`, flags.replace('u', ''));
        }
        console.error('Regex error:', e);
        return new RegExp(`(${escaped})`, flags.replace('u', ''));
    }
}
