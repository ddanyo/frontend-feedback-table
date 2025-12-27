import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import useZustandStore from '../../../store/useZustandStore';

import { NativeTable } from '../NativeTable';
import { useStore } from '../../../store/useStore';
import { TanstackTable } from '../TanstackTable';

export function TanstackVirtualZustand() {
    console.log('TVNativeTableZustand');

    const { get } = useStore.Settings();
    const allItems = useZustandStore((state) => state.allItems);
    const searchResults = useZustandStore((state) => state.searchResults);

    const items = useMemo(
        () => (searchResults.length > 0 ? searchResults : allItems),
        [searchResults, allItems]
    );

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 60,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
            : 0;

    if (items.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    const visibleItems = (virtualItems ?? []).map((v) => allItems[v.index]).filter(Boolean);

    return (
        <div
            ref={tableContainerRef}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
            {get().tanstackTable ? (
                <TanstackTable
                    items={allItems}
                    virtualRows={virtualItems ?? []}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                    measureElement={virtualizer.measureElement}
                />
            ) : (
                <NativeTable
                    items={visibleItems}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                />
            )}

            <div className="min-h-10 flex justify-center items-center w-full my-2">
                <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
            </div>
        </div>
    );
}
