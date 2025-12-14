import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { NativeTable } from './NativeTable';
import { FeedbackSort } from '../constans/FeedbackSort';
import { TanstackTable } from './TanstackTable';
import { getFeedbacks } from '../api/feedbacks';
import { useSettings } from '../context/AppContext';
import { useVirtualizer } from '@tanstack/react-virtual';

export function TanstackVirtual() {
    const { pageSettings, searchSettings, settings } = useSettings();
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const getFeedbacksQuery = useInfiniteQuery({
        queryKey: ['feedbacks', searchSettings, pageSettings.pageSize],
        queryFn: async ({ pageParam = 1 }) => {
            const params = {
                skip: (pageParam - 1) * pageSettings.pageSize,
                take: pageSettings.pageSize,
                search: searchSettings.searchTerm,
                sortBy: FeedbackSort.NEWEST,
                caseSensitive: searchSettings.caseSensitive,
                wholeWord: searchSettings.wholeWord,
            };
            return await getFeedbacks(params);
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.flatMap((p) => p.items).length;
            if (totalLoaded < lastPage.total) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });

    const data = getFeedbacksQuery.data;

    const allItems = useMemo(() => {
        return data?.pages.flatMap((page) => page.items) ?? [];
    }, [data]);

    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: getFeedbacksQuery.hasNextPage ? allItems.length + 1 : allItems.length,
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
            getFeedbacksQuery.hasNextPage &&
            !getFeedbacksQuery.isFetchingNextPage
        ) {
            getFeedbacksQuery.fetchNextPage();
        }
    }, [
        virtualItems,
        allItems.length,
        getFeedbacksQuery.hasNextPage,
        getFeedbacksQuery.isFetchingNextPage,
        getFeedbacksQuery.fetchNextPage,
        getFeedbacksQuery,
    ]);

    if (getFeedbacksQuery.isPending) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Загрузка...
            </div>
        );
    }

    if (getFeedbacksQuery.isError) {
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {getFeedbacksQuery.error instanceof Error
                    ? getFeedbacksQuery.error.message
                    : 'Неизвестная ошибка'}
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

    return (
        <div
            ref={tableContainerRef}
            className="flex flex-col h-full overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
            {settings.tanstackTable ? (
                <TanstackTable data={allItems} virtualizer={virtualizer} />
            ) : (
                <NativeTable data={allItems} virtualizer={virtualizer} />
            )}

            <div className="min-h-10 flex justify-center items-center w-full mt-2 pb-2">
                {getFeedbacksQuery.isFetchingNextPage && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}

                {!getFeedbacksQuery.hasNextPage && allItems.length > 0 && (
                    <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
                )}
            </div>
        </div>
    );
}
