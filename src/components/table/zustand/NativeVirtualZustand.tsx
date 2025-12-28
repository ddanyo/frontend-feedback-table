import { useMemo, useRef } from 'react';
import { NativeTable } from '../NativeTable';
import { TanstackTable } from '../TanstackTable';

import { useStore } from '../../../store/useStore';
import useZustandStore from '../../../store/useZustandStore';

export function NativeVirtualZustand() {
    console.log('NativeVirtualZustand');

    const { get: getSettings } = useStore.Settings();

    const allItems = useZustandStore((state) => state.allItems);
    const searchResults = useZustandStore((state) => state.searchResults);
    const isSearching = useZustandStore((state) => state.isSearching);
    const isLoading = useZustandStore((state) => state.isLoading);
    const error = useZustandStore((state) => state.error);

    const items = useMemo(
        () => (isSearching ? searchResults : allItems),
        [isSearching, searchResults, allItems]
    );

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (isLoading && allItems.length === 0)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium animate-pulse mt-20">
                Загрузка данных...
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error}
            </div>
        );
    if (items.length === 0 && !isLoading)
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
                <TanstackTable items={items} />
            ) : (
                <NativeTable items={items} />
            )}
            <div className="min-h-10 flex justify-center items-center w-full my-2">
                <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
            </div>
        </div>
    );
}
