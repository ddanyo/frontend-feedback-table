import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NativeTable } from '../NativeTable';
import { FeedbackSort } from '../../../constans/FeedbackSort';
import { TanstackTable } from '../TanstackTable';
import { getFeedbacks } from '../../../api/feedbacks';
import { type Feedback, type FeedbackResponse } from '../../../interfaces/Feedback';
import { useStore } from '../../../store/useStore';

export function NativeVirtualApi() {
    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();
    const { get: getSettings } = useStore.Settings();

    const [localPage, setLocalPage] = useState(1);
    const [allItems, setAllItems] = useState<Feedback[]>([]);

    const queryParams = useMemo(
        () => ({
            skip: (localPage - 1) * getPageSettings().pageSize,
            take: getPageSettings().pageSize,
            search: getSearchSettings().searchTerm,
            sortBy: FeedbackSort.NEWEST,
            caseSensitive: getSearchSettings().caseSensitive,
            wholeWord: getSearchSettings().wholeWord,
        }),
        [localPage, getPageSettings, getSearchSettings]
    );
    const getFeedbacksQuery = useQuery<FeedbackResponse, Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: async ({ signal }) => {
            return await getFeedbacks(queryParams, signal);
        },
    });

    const { data, isFetching, error, isLoading } = getFeedbacksQuery;

    const isLastPage = data && data.items.length < getPageSettings().pageSize;

    useEffect(() => {
        setLocalPage(1);
        setAllItems([]);
    }, [getPageSettings, getSearchSettings]);

    useEffect(() => {
        if (!data?.items || data.items.length === 0) return;

        setAllItems((prevItems) => {
            if (localPage === 1) {
                return data.items;
            }

            return [...prevItems, ...data.items];
        });
    }, [data, localPage]);

    const observerTarget = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = observerTarget.current;
        const scrollContainer = scrollContainerRef.current;

        if (!element || !scrollContainer || isFetching || isLastPage || error) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setLocalPage((prev) => prev + 1);
                }
            },
            {
                root: scrollContainer,
                threshold: 0.05,
                rootMargin: '0px 0px 600px 0px',
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [isFetching, isLastPage, error, allItems.length]);

    if (isLoading && localPage === 1 && allItems.length === 0)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Загрузка...
            </div>
        );
    if (error)
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error.message}
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

            <div className="min-h-10 flex justify-center items-center w-full my-2">
                {isFetching && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}

                {isLastPage && !isFetching && allItems.length > 0 && (
                    <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
                )}
            </div>

            <div ref={observerTarget}></div>
        </div>
    );
}
