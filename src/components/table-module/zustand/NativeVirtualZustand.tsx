import { useMemo, useRef, useState, useLayoutEffect, useCallback } from 'react';
import { NativeTable, TanstackTable } from '@components';
import { useStore, useZustandStore } from '@store';

interface CustomVirtualItem {
    key: number | string;
    index: number;
    start: number;
    end: number;
    size: number;
    lane: number;
}

export function NativeVirtualZustand() {
    console.log('NativeVirtualZustand (Custom Dynamic Implementation)');

    const { get } = useStore.Settings();
    const allItems = useZustandStore((state) => state.allItems);
    const searchResults = useZustandStore((state) => state.searchResults);
    const isSearching = useZustandStore((state) => state.isSearching);
    const isLoading = useZustandStore((state) => state.isLoading);
    const error = useZustandStore((state) => state.error);

    const items = useMemo(
        () => (isSearching ? searchResults : allItems),
        [isSearching, searchResults, allItems]
    );

    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(600);

    const sizeMap = useRef<{ [key: number]: number }>({});
    const [, setForceUpdate] = useState(0);

    const ESTIMATED_ROW_HEIGHT = 60;
    const OVERSCAN = 5;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    useLayoutEffect(() => {
        if (tableContainerRef.current) {
            setContainerHeight(tableContainerRef.current.clientHeight);
        }
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContainerHeight(entry.contentRect.height);
            }
        });
        if (tableContainerRef.current) {
            observer.observe(tableContainerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    const measureElement = useCallback((node: HTMLElement | null) => {
        if (!node) return;

        const indexAttr = node.getAttribute('data-index');
        if (!indexAttr) return;

        const index = parseInt(indexAttr, 10);
        const height = node.getBoundingClientRect().height;

        if (sizeMap.current[index] !== height) {
            sizeMap.current[index] = height;

            requestAnimationFrame(() => {
                setForceUpdate((prev) => prev + 1);
            });
        }
    }, []);

    const { virtualItems, paddingTop, paddingBottom } = useMemo(() => {
        const count = items.length;
        const visibleNodes: CustomVirtualItem[] = [];

        let currentOffset = 0;
        let startParams = { index: 0, offset: 0 };
        let endParams = { index: 0, offset: 0 };
        let foundStart = false;

        for (let i = 0; i < count; i++) {
            const size = sizeMap.current[i] || ESTIMATED_ROW_HEIGHT;
            const nextOffset = currentOffset + size;

            if (!foundStart && nextOffset > scrollTop) {
                const overscanStartIndex = Math.max(0, i - OVERSCAN);

                let realStartOffset = currentOffset;
                for (let j = i - 1; j >= overscanStartIndex; j--) {
                    realStartOffset -= sizeMap.current[j] || ESTIMATED_ROW_HEIGHT;
                }

                startParams = { index: overscanStartIndex, offset: realStartOffset };
                foundStart = true;
            }

            if (foundStart && currentOffset > scrollTop + containerHeight) {
                endParams = { index: Math.min(count, i + OVERSCAN), offset: nextOffset };
                break;
            }

            if (i === count - 1) {
                endParams = { index: count, offset: nextOffset };
            }

            currentOffset = nextOffset;
        }

        if (!foundStart) {
            startParams = { index: 0, offset: 0 };

            let tempOffset = 0;
            for (let i = 0; i < count; i++) {
                tempOffset += sizeMap.current[i] || ESTIMATED_ROW_HEIGHT;
                if (tempOffset > containerHeight) {
                    endParams = { index: i + OVERSCAN, offset: tempOffset };
                    break;
                }
            }
            if (endParams.index === 0) endParams = { index: count, offset: tempOffset };
        }

        let accumulatedTop = startParams.offset;
        for (let i = startParams.index; i < endParams.index && i < count; i++) {
            const size = sizeMap.current[i] || ESTIMATED_ROW_HEIGHT;
            visibleNodes.push({
                index: i,
                start: accumulatedTop,
                end: accumulatedTop + size,
                size: size,
                key: i,
                lane: 0,
            });
            accumulatedTop += size;
        }

        const knownHeight = Object.values(sizeMap.current).reduce((acc, val) => acc + val, 0);
        const knownCount = Object.keys(sizeMap.current).length;
        const avgHeight = knownCount > 0 ? knownHeight / knownCount : ESTIMATED_ROW_HEIGHT;
        const finalTotalHeight = knownHeight + (count - knownCount) * avgHeight;

        return {
            virtualItems: visibleNodes,
            totalHeight: finalTotalHeight,
            paddingTop: startParams.offset,
            paddingBottom: Math.max(0, finalTotalHeight - accumulatedTop),
        };
    }, [items.length, scrollTop, containerHeight]);

    const visibleItemsForNative = useMemo(() => {
        return virtualItems.map((v) => ({
            ...items[v.index],
            virtualIndex: v.index,
        }));
    }, [virtualItems, items]);

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
            ref={tableContainerRef}
            onScroll={handleScroll}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white relative"
        >
            {get().tanstackTable ? (
                <TanstackTable
                    items={items}
                    virtualRows={virtualItems}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                    measureElement={measureElement}
                />
            ) : (
                <NativeTable
                    items={visibleItemsForNative}
                    paddingTop={paddingTop}
                    paddingBottom={paddingBottom}
                    measureElement={measureElement}
                />
            )}

            <div className="min-h-10 flex justify-center items-center w-full my-2">
                <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
            </div>
        </div>
    );
}
