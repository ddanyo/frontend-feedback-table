import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FeedbackSort } from '../../constans/FeedbackSort';
import { getFeedbacks } from '../../api/feedbacks';
import { useSettings } from '../../context/AppContext';
import { useVirtualizer } from '@tanstack/react-virtual';
import { StarIcon } from '../icons/StarIcon';
import { formatClockString } from '../../utils/formatClockString';
import { getHighlightedText } from '../../utils/highlight';

export function TVNativeTable() {
    const { pageSettings, searchSettings } = useSettings();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const getFeedbacksQuery = useInfiniteQuery({
        queryKey: ['feedbacks', searchSettings],
        queryFn: async ({ pageParam }) => {
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

    // eslint-disable-next-line react-hooks/incompatible-library
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

    return (
        <div
            ref={tableContainerRef}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
            <table className="divide-y divide-slate-100 relative table-fixed">
                <thead className="bg-slate-100 table-fixed sticky top-0 z-10 shadow-sm h-12">
                    <tr>
                        <th className="text-center text-sm font-medium text-slate-500 uppercase w-[10%]">
                            ID
                        </th>
                        <th className="text-center text-sm font-medium text-slate-500 uppercase w-[10%]">
                            Рейтинг
                        </th>
                        <th className="text-center text-sm font-medium text-slate-500 uppercase w-[20%]">
                            Дата
                        </th>
                        <th className="text-center text-sm font-medium text-slate-500 uppercase w-[60%]">
                            Текст отзыва
                        </th>
                    </tr>
                </thead>
                <tbody
                    className="bg-white divide-y divide-slate-200"
                    style={{ contain: 'layout paint' }}
                >
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} colSpan={4} />
                        </tr>
                    )}

                    {virtualItems.map((virtualRow) => {
                        const item = allItems[virtualRow.index];
                        if (!item) return null;

                        return (
                            <tr
                                key={virtualRow.key}
                                ref={virtualizer.measureElement}
                                data-index={virtualRow.index}
                                className="hover:bg-slate-100"
                            >
                                <td className="text-center p-3 text-sm text-slate-500">
                                    #{item.id}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`flex items-center justify-center ${item.rating === 5 ? 'text-green-500' : item.rating === 1 ? 'text-red-500' : 'text-yellow-500'}`}
                                    >
                                        <StarIcon className="w-5 h-5" />
                                        <span className="text-sm text-slate-500 font-medium ml-2">
                                            {item.rating}
                                        </span>
                                    </span>
                                </td>
                                <td className="text-center p-3 text-sm text-slate-500">
                                    {formatClockString(new Date(item.date_time))}
                                </td>
                                <td className="text-left p-3 text-slate-600 text-base font-medium wrap-break-word whitespace-pre-wrap">
                                    {getHighlightedText(
                                        item.feedback_text,
                                        searchSettings.searchTerm,
                                        searchSettings.caseSensitive,
                                        searchSettings.wholeWord
                                    )}
                                </td>
                            </tr>
                        );
                    })}

                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} colSpan={4} />
                        </tr>
                    )}
                </tbody>
            </table>

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
