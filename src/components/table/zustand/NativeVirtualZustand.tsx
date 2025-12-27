import { useEffect, useRef, useState } from 'react';
import { NativeTable } from '../NativeTable';
import { TanstackTable } from '../TanstackTable';
import { type Feedback } from '../../../interfaces/Feedback';
import { useStore } from '../../../store/useStore';
import useAppStore from '../../../store/useZustandStore';

export function NativeVirtualZustand() {
    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();
    const { get: getSettings } = useStore.Settings();

    const [localPage, setLocalPage] = useState(1);
    const [allItems, setAllItems] = useState<Feedback[]>([]);

    const { error, isLoading } = useAppStore.getState();

    useEffect(() => {
        setLocalPage(1);
        setAllItems([]);
    }, [getPageSettings, getSearchSettings]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (isLoading && localPage === 1 && allItems.length === 0)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Загрузка...
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error}
            </div>
        );
    if (allItems.length === 0 && !isLoading)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );

    return (
        <div
            ref={scrollContainerRef}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
            {getSettings().tanstackTable ? (
                <TanstackTable items={allItems} />
            ) : (
                <NativeTable items={allItems} />
            )}
        </div>
    );
}
