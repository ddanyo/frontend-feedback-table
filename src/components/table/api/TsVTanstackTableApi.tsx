import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import { FeedbackSort } from '../../../constans/FeedbackSort';

import { getFeedbacks } from '../../../api/feedbacks';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getHighlightedText } from '../../../utils/highlight';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { Feedback } from '../../../interfaces/Feedback';
import { StarIcon } from '../../icons/StarIcon';
import { formatClockString } from '../../../utils/formatClockString';
import { useStore } from '../../../store/useStore';

const FeedbackTextCell = ({ text }: { text: string }) => {
    const { get } = useStore.SearchSettings();

    return (
        <span className="text-slate-600 font-medium">
            {getHighlightedText(text, get().searchTerm, get().caseSensitive, get().wholeWord)}
        </span>
    );
};

export function TsVTanstackTableApi() {
    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();

    const tableContainerRef = useRef<HTMLDivElement>(null);

    const getFeedbacksQuery = useInfiniteQuery({
        queryKey: ['feedbacks', getSearchSettings, getPageSettings],
        queryFn: async ({ pageParam = 1 }) => {
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
        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.flatMap((p) => p.items).length;
            if (totalLoaded < lastPage.total) {
                return allPages.length + 1;
            }
            return undefined;
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

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Feedback>();

        return [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (props) => `#${props.getValue()}`,
            }),
            columnHelper.accessor('rating', {
                header: 'Рейтинг',
                cell: (props) => {
                    const rating = props.getValue();
                    const colorClass =
                        rating === 5
                            ? 'text-green-500'
                            : rating === 1
                              ? 'text-red-500'
                              : 'text-yellow-500';
                    return (
                        <span className={`flex items-center justify-center ${colorClass}`}>
                            <StarIcon className="w-5 h-5" />
                            <span className="text-sm text-slate-500 font-medium ml-2">
                                {rating}
                            </span>
                        </span>
                    );
                },
            }),
            columnHelper.accessor('date_time', {
                header: 'Дата',
                cell: (props) => formatClockString(new Date(props.getValue())),
            }),
            columnHelper.accessor('feedback_text', {
                header: 'Текст отзыва',
                cell: (props) => <FeedbackTextCell text={props.getValue() ?? ''} />,
            }),
        ];
    }, []);

    const table = useReactTable({
        data: allItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

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
            <table className="w-full divide-y divide-slate-100 relative table-fixed">
                <thead className="bg-blue-100 table-fixed sticky top-0 z-10 shadow-sm h-12">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`text-center text-sm font-medium text-slate-500 uppercase ${
                                        header.id === 'feedback_text'
                                            ? 'w-[60%]'
                                            : header.id === 'date_time'
                                              ? 'w-[20%]'
                                              : 'w-[10%]'
                                    }`}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} colSpan={4} />
                        </tr>
                    )}
                    {virtualItems.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        if (!row) return null;

                        return (
                            <tr
                                key={row.id}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className="hover:bg-slate-100"
                            >
                                {row.getAllCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`p-3 text-slate-500 ${cell.column.id === 'feedback_text' ? 'text-base text-slate-600 font-medium text-left' : 'text-center text-sm'}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
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
