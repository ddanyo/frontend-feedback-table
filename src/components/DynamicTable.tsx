import { useState, useEffect, useRef } from 'react';
import { getFeedbacks } from '../api/feedbacks';
import { FeedbackSort } from '../constans/FeedbackSort';
import { type Feedback } from '../interfaces/Feedback';
import { NativeTable } from './NativeTable';
import { TanstackTable } from './TanstackTable';

interface Props {
    searchTerm: string;
    pageSize: number;
    useTanstackTable: boolean;
}

export function DynamicTable({ searchTerm, pageSize, useTanstackTable }: Props) {
    const [items, setItems] = useState<Feedback[]>([]);
    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const observerTarget = useRef<HTMLDivElement>(null);

    const loadData = async (targetPage: number, reset: boolean) => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
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
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
            setError(errorMessage);
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

    useEffect(() => {
        if (isLoading || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // entries[0] — observerTarget
                if (entries[0].isIntersecting) {
                    loadData(page + 1, false);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px',
            }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, hasMore, page, searchTerm, pageSize]);

    if (isLoading && items.length === 0)
        return <div className="text-center mt-20 text-slate-500">Загрузка...</div>;
    if (error && items.length === 0)
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (items.length === 0 && !isLoading)
        return <div className="text-center mt-20 text-slate-500">Нет данных...</div>;

    return (
        <>
            {useTanstackTable ? <TanstackTable data={items} /> : <NativeTable data={items} />}

            <div ref={observerTarget} className="h-8 flex justify-center items-center w-full mt-2">
                {isLoading && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}
                {!hasMore && items.length > 0 && (
                    <span className="text-slate-400 text-sm">Все записи загружены</span>
                )}
            </div>
        </>
    );
}
