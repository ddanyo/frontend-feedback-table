import { type ReactNode } from 'react';

export const getHighlightedText = (
    text: string | undefined,
    highlight: string,
    caseSensitive: boolean = false,
    wholeWord: boolean = false
): ReactNode => {
    if (!text) return null;
    if (!highlight.trim()) return text;

    const escapeReg = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    let pattern = escapeReg(highlight);

    if (wholeWord) {
        pattern = `(?<![\\p{L}\\p{N}_])${pattern}(?![\\p{L}\\p{N}_])`;
    }

    const regexPattern = `(${pattern})`;

    const flags = caseSensitive ? 'gu' : 'giu';

    try {
        const regex = new RegExp(regexPattern, flags);
        const parts = text.split(regex);

        return parts.map((part, index) =>
            index % 2 === 1 ? (
                <span key={index} className="bg-blue-200 text-slate-900 rounded-sm">
                    {part}
                </span>
            ) : (
                part
            )
        );
    } catch (e) {
        console.error('Regex error:', e);
        return text;
    }
};
