import { useEffect, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    // ChevronsLeft,
    // ChevronsRight
} from 'lucide-react';
import { useSettings } from '../../context/AppContext';

export function PageSwitcher() {
    const { pageSettings, setPageSettings } = useSettings();
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
            setPageSettings({ ...pageSettings, page: numVal });
        }
    };

    function handlePrevPage() {
        if (pageSettings.page > 1) {
            setPageSettings({ ...pageSettings, page: pageSettings.page - 1 });
        }
    }
    function handleNextPage() {
        setPageSettings({ ...pageSettings, page: pageSettings.page + 1 });
    }

    return (
        <div className="flex items-center justify-center gap-3 bg-none h-1/2 w-full rounded-lg">
            <button
                onClick={handlePrevPage}
                disabled={pageSettings.page === 1}
                className="flex items-center justify-center text-blue-500 text-2xl bg-none w-8 h-8 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-slate-200"
            >
                <ChevronLeft size={30} strokeWidth={2.5} />
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
                className="flex items-center justify-center text-blue-500 text-3xl bg-none w-8 h-8 rounded-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-slate-200"
                onClick={handleNextPage}
                disabled={pageSettings.page === pageSettings.countPages}
            >
                <ChevronRight size={30} strokeWidth={2.5} />
            </button>
        </div>
    );
}
