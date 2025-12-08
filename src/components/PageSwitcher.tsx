import { useEffect, useState } from 'react';

export function PageSwitcher({
    pageSettings,
    onPageSettingsChange,
}: {
    pageSettings: { page: number; pageSize: number; countPages: number };
    onPageSettingsChange: (newSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    }) => void;
}) {
    const [localPage, setLocalPage] = useState<string>(pageSettings.page.toString());

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPage(pageSettings.page.toString());
    }, [pageSettings.page]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPage(e.target.value);
    };

    const commitPageChange = () => {
        let numVal = parseInt(localPage, 10);

        if (isNaN(numVal) || numVal < 1) {
            setLocalPage(pageSettings.page.toString());
            return;
        }

        if (numVal > pageSettings.countPages) {
            numVal = pageSettings.countPages;
        }

        setLocalPage(numVal.toString());

        if (numVal !== pageSettings.page) {
            onPageSettingsChange({ ...pageSettings, page: numVal });
        }
    };

    function handlePrevPage() {
        if (pageSettings.page > 1) {
            onPageSettingsChange({ ...pageSettings, page: pageSettings.page - 1 });
        }
    }
    function handleNextPage() {
        onPageSettingsChange({ ...pageSettings, page: pageSettings.page + 1 });
    }

    return (
        <div className="flex items-center justify-center gap-3 bg-none h-1/2 w-full rounded-lg">
            <button
                onClick={handlePrevPage}
                disabled={pageSettings.page === 1}
                className="flex items-center justify-center text-slate-700 text-2xl bg-blue-500 w-12 h-7.5 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
            </button>
            <input
                type="number"
                min={1}
                max={pageSettings.countPages}
                inputMode="numeric"
                value={localPage}
                onChange={handleInputChange}
                onBlur={commitPageChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        (e.target as HTMLInputElement).blur();
                    }
                }}
                className="w-14 h-7 text-center text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 no-spinner"
            />
            <button
                className="flex items-center justify-center text-slate-700 text-3xl bg-blue-500 w-12 h-7.5 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleNextPage}
                disabled={pageSettings.page === pageSettings.countPages}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                </svg>
            </button>
        </div>
    );
}
