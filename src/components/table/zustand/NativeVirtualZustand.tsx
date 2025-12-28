import { useRef } from 'react';
import { NativeTable } from '../NativeTable';
import { TanstackTable } from '../TanstackTable';

import { useStore } from '../../../store/useStore';
import useZustandStore from '../../../store/useZustandStore';

export function NativeVirtualZustand() {
    console.log('NativeVirtualZustand');

    const { get: getSettings } = useStore.Settings();

    const allItems = useZustandStore((state) => state.allItems);
    const isLoading = useZustandStore((state) => state.isLoading);
    const error = useZustandStore((state) => state.error);

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
