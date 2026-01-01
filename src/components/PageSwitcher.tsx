import { useEffect, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react'; // npm install @ant-design/icons@6.1.2 --save
import { useStore } from '../store/useStore';

export function PageSwitcher({ countPages }: { countPages: number }) {
    console.log('PageSwitcher');

    const {
        get: getPageSettings,
        set: setPageSettings,
        update: updatePageSettings,
    } = useStore.PageSettings();
    const [localPage, setLocalPage] = useState<string>(getPageSettings().page.toString());

    useEffect(() => {
        setLocalPage(getPageSettings().page.toString());
    }, [getPageSettings]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPage(e.target.value);
    };

    const commitPageChange = () => {
        const current = getPageSettings();
        let numVal = parseInt(localPage, 10);

        if (isNaN(numVal) || numVal < 1) {
            setLocalPage(current.page.toString());
            return;
        }

        if (numVal > countPages) {
            numVal = countPages;
        }

        setLocalPage(numVal.toString());

        setPageSettings({ ...current, page: numVal });
    };

    function handlePrevPage() {
        updatePageSettings((prev) => ({
            ...prev,
            page: Math.max(1, prev.page - 1),
        }));
    }

    function handleNextPage() {
        updatePageSettings((prev) => ({
            ...prev,
            page: Math.min(countPages, prev.page + 1),
        }));
    }

    return (
        <div className="flex items-center justify-center gap-3 bg-none h-1/2 w-full rounded-lg">
            <button
                onClick={handlePrevPage}
                disabled={getPageSettings().page === 1}
                className="flex items-center justify-center text-blue-500 text-2xl bg-none w-8 h-8 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-slate-200"
            >
                <ChevronsLeft size={25} strokeWidth={2.5} />
            </button>
            <input
                type="number"
                min={1}
                max={countPages}
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
                className="flex items-center justify-center text-blue-500 text-3xl bg-none w-8 h-8 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-slate-200"
                onClick={handleNextPage}
                disabled={getPageSettings().page === countPages}
            >
                <ChevronsRight size={25} strokeWidth={2.5} />
            </button>
        </div>
    );
}
