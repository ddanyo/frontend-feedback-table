import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeTable } from './NativeTable';
import { FeedbackSort } from '../constans/FeedbackSort';
import { TanstackTable } from './TanstackTable';
import type { Feedback } from '../interfaces/Feedback';
import { getFeedbacks } from '../api/feedbacks';

export function DynamicTable({
    searchTerm,
    pageSize,
    useTanstackTable,
}: {
    searchTerm: string;
    pageSize: number;
    useTanstackTable: boolean;
}) {
    const [items, setItems] = useState<Feedback[]>([]);
    const [localPage, setLocalPage] = useState(1);

    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(
        async (targetPage: number, reset: boolean) => {
            if (reset) {
                setLocalPage(1);
                setItems([]);
                setHasMore(true);
            }
            setIsLoading(true);

            try {
                const params = {
                    skip: (targetPage - 1) * pageSize,
                    take: pageSize,
                    search: searchTerm,
                    sortBy: FeedbackSort.NEWEST,
                };
                const data = await getFeedbacks(params);
                setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
                setLocalPage(targetPage);
                setHasMore(targetPage < data.totalPages);
            } catch (e: unknown) {
                const errorMessage =
                    e instanceof Error ? e.message : 'An unexpected error occurred';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        [searchTerm, pageSize]
    );

    useEffect(() => {
        loadData(1, true);
    }, [searchTerm, pageSize, loadData]);

    const observerOptions = useMemo(
        () => ({
            threshold: 0.1,
            rootMargin: '100px',
        }),
        []
    );
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isLoading || !hasMore) return;
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadData(localPage + 1, false);
                }
            });
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [observerOptions, isLoading, hasMore, localPage, loadData]);

    if (isLoading && items.length === 0)
        return <div className="text-center mt-20 text-slate-500">Загрузка...</div>;
    if (error && items.length === 0)
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (items.length === 0 && !isLoading)
        return <div className="text-center mt-20 text-slate-500">Нет данных...</div>;

    return (
        <>
            {useTanstackTable ? (
                <TanstackTable data={items} />
            ) : (
                <NativeTable data={items} searchTerm={searchTerm} />
            )}

            <div ref={observerTarget} className="h-8 flex justify-center items-center w-full mt-2">
                {isLoading && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}
                {!hasMore && <span className="text-slate-400 text-sm">Все записи загружены</span>}
            </div>
        </>
    );
}
