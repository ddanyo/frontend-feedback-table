import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedbackSort } from '../../../constans/FeedbackSort';
import { getFeedbacks } from '../../../api/feedbacks';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useStore } from '../../../store/useStore';
import { NativeTable } from '../NativeTable';

export function TsVNativeTableApi() {
    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const getFeedbacksQuery = useInfiniteQuery({
        queryKey: ['feedbacks', getSearchSettings, getPageSettings],
        queryFn: async ({ pageParam }) => {
            const params = {
                skip: (pageParam - 1) * getPageSettings().pageSize,
                take: getPageSettings().pageSize,
                search: getSearchSettings().searchTerm,
                sortBy: FeedbackSort.NEWEST,
                caseSensitive: getSearchSettings().caseSensitive,
                wholeWord: getSearchSettings().wholeWord,
            };
            return await getFeedbacks(params);
        },
        getNextPageParam: (lastPage, _, lastPageParam) => {
            if (lastPage.total === 0) {
                return undefined;
            }
            return lastPageParam + 1;
        },
        initialPageParam: 1,
    });

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, error, isError, isLoading } =
        getFeedbacksQuery;

    const allItems = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) ?? [];
    }, [data]);

    const virtualizer = useVirtualizer({
        count: allItems.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 60,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();

    useEffect(() => {
        const lastItem = virtualItems[virtualItems.length - 1];
        if (
            lastItem &&
            lastItem.index >= allItems.length - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [virtualItems, allItems.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? (virtualizer.getTotalSize() ?? 0) - virtualItems[virtualItems.length - 1].end
            : 0;

    if (isLoading) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Загрузка...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error instanceof Error ? error.message : 'Неизвестная ошибка'}
            </div>
        );
    }

    if (allItems.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    const visibleItems = (virtualItems ?? []).map((v) => allItems[v.index]).filter(Boolean);
    console.log('visibleItems:', visibleItems);

    return (
        <div
            ref={tableContainerRef}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
            <NativeTable
                items={visibleItems}
                paddingTop={paddingTop}
                paddingBottom={paddingBottom}
            />

            <div className="min-h-10 flex justify-center items-center w-full my-2">
                {isFetchingNextPage && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}

                {!hasNextPage && allItems.length > 0 && (
                    <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
                )}
            </div>
        </div>
    );
}
