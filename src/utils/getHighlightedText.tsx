import type { ReactNode } from 'react';
import { buildSearchRegex } from '@/utils/buildSearchRegex';

export const getHighlightedText = (
    text: string | undefined,
    highlight: string,
    caseSensitive = false,
    wholeWord = false
): ReactNode => {
    if (!text) return null;
    if (!highlight) return text;

    const regex = buildSearchRegex(highlight, caseSensitive, wholeWord);
    if (!regex) return text;

    try {
        const parts = text.split(regex);
        return parts.map((part, i) =>
            i % 2 === 1 ? (
                <span key={i} className="bg-blue-200 text-slate-900 rounded-sm">
                    {part}
                </span>
            ) : (
                part
            )
        );
    } catch (e) {
        console.error('Highlight error:', e);
        return text;
    }
};
