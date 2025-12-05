export const getHighlightedText = (text: string | undefined, highlight: string) => {
    if (!text) return null;
    if (!highlight.trim()) return text;

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
        regex.test(part) ? (
            <span key={index} className="bg-blue-200 text-slate-900 rounded-sm">
                {part}
            </span>
        ) : (
            part
        )
    );
};
