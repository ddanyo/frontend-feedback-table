import { useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getFeedbacks } from '../api/feedbacks';
import { FeedbackSort } from '../constans/FeedbackSort';
import { type Feedback } from '../interfaces/Feedback';
import { StarIcon } from './icons/StarIcon';

interface Props {
    searchTerm: string;
    pageSize: number;
}

export function VirtualTable({ searchTerm, pageSize }: Props) {
    const [items, setItems] = useState<Feedback[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadData = async (targetPage: number, reset: boolean) => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            const data = await getFeedbacks({
                skip: (targetPage - 1) * pageSize,
                take: pageSize,
                search: searchTerm,
                sortBy: FeedbackSort.NEWEST,
            });

            setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
            setHasMore(targetPage < data.totalPages);
            setPage(targetPage);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setItems([]);
        setHasMore(true);
        loadData(1, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, pageSize]);

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: hasMore ? items.length + 1 : items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();

    useEffect(() => {
        const [lastItem] = [...virtualItems].reverse();

        if (!lastItem) return;

        if (lastItem.index >= items.length - 1 && hasMore && !isLoading) {
            loadData(page + 1, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [virtualItems, items.length, hasMore, isLoading, page]);

    const formatClockString = (dateString: string): string => {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'short',
        }).format(new Date(dateString));
    };

    return (
        <div className="flex flex-col h-full w-full bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-200 shadow-sm text-xs font-medium text-slate-500 uppercase py-3 shrink-0 z-10">
                <div className="col-span-1 px-4">ID</div>
                <div className="col-span-2 px-4">Рейтинг</div>
                <div className="col-span-3 px-4">Дата</div>
                <div className="col-span-6 px-4">Текст отзыва</div>
            </div>

            <div ref={parentRef} className="flex-1 w-full overflow-y-auto">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualItems.map((virtualRow) => {
                        const isLoaderRow = virtualRow.index > items.length - 1;
                        const item = items[virtualRow.index];

                        return (
                            <div
                                key={virtualRow.key}
                                data-index={virtualRow.index}
                                ref={rowVirtualizer.measureElement}
                                className={`absolute top-0 left-0 w-full grid grid-cols-12 items-center px-4 py-4 text-sm border-b border-slate-100 hover:bg-slate-50 ${
                                    isLoaderRow ? 'justify-center flex' : ''
                                }`}
                                style={{
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                {isLoaderRow ? (
                                    <span className="text-slate-400 py-2 animate-pulse">
                                        Загрузка данных...
                                    </span>
                                ) : (
                                    <>
                                        <div className="col-span-1 text-slate-500">#{item.id}</div>
                                        <div className="col-span-2">
                                            <span
                                                className={`flex items-center ${
                                                    item.rating === 5
                                                        ? 'text-green-500'
                                                        : item.rating === 1
                                                          ? 'text-red-500'
                                                          : 'text-yellow-500'
                                                }`}
                                            >
                                                <StarIcon className="w-5 h-5" />
                                                <span className="ml-2 font-medium text-slate-500">
                                                    {item.rating}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-slate-500">
                                            {formatClockString(item.date_time)}
                                        </div>
                                        <div className="col-span-6 text-slate-600 font-medium">
                                            {item.feedback_text}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
