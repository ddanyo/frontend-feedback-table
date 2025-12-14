import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { NativeTable } from './NativeTable';
import { FeedbackSort } from '../constans/FeedbackSort';
import { TanstackTable } from './TanstackTable';
import { getFeedbacks } from '../api/feedbacks';
import { useSettings } from '../context/AppContext';
import { type Feedback, type FeedbackResponse } from '../interfaces/Feedback';

export function NativeVirtual() {
    const { pageSettings, searchSettings, settings } = useSettings();

    const [localPage, setLocalPage] = useState(1);
    const [allItems, setAllItems] = useState<Feedback[]>([]);

    const queryParams = {
        skip: (localPage - 1) * pageSettings.pageSize,
        take: pageSettings.pageSize,
        search: searchSettings.searchTerm,
        sortBy: FeedbackSort.NEWEST,
        caseSensitive: searchSettings.caseSensitive,
        wholeWord: searchSettings.wholeWord,
    };

    const getFeedbacksQuery = useQuery<FeedbackResponse, Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: () => getFeedbacks(queryParams),
    });

    const data = getFeedbacksQuery.data;

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPage(1);
        setAllItems([]);
    }, [
        searchSettings.searchTerm,
        pageSettings.pageSize,
        searchSettings.caseSensitive,
        searchSettings.wholeWord,
    ]);

    useEffect(() => {
        if (!data?.items) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAllItems((prevItems) => {
            if (localPage === 1) {
                return data.items;
            }

            return [...prevItems, ...data.items];
        });
    }, [data, localPage]);

    const observerOptions = useMemo(
        () => ({
            threshold: 0.1,
            rootMargin: '20%',
        }),
        []
    );
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = observerTarget.current;
        const isDataExhausted = data && data.items.length < pageSettings.pageSize;
        if (
            !element ||
            getFeedbacksQuery.isLoading ||
            getFeedbacksQuery.isFetching ||
            isDataExhausted ||
            getFeedbacksQuery.error
        )
            return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setLocalPage((prev) => prev + 1);
            }
        }, observerOptions);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [
        getFeedbacksQuery.isLoading,
        allItems.length,
        allItems,
        data,
        pageSettings.pageSize,
        getFeedbacksQuery.isFetching,
        getFeedbacksQuery.error,
        observerOptions,
    ]);

    if (getFeedbacksQuery.isLoading)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Загрузка...
            </div>
        );
    if (getFeedbacksQuery.error)
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {getFeedbacksQuery.error.message}
            </div>
        );
    if (allItems.length === 0 && !getFeedbacksQuery.isLoading)
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );

    return (
        <div className="flex flex-col h-full overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white">
            {settings.tanstackTable ? (
                <TanstackTable data={allItems} />
            ) : (
                <NativeTable data={allItems} />
            )}

            <div ref={observerTarget} className="h-8 flex justify-center items-center w-full mt-2">
                {getFeedbacksQuery.isLoading && (
                    <span className="text-slate-500 text-sm animate-pulse font-medium">
                        Подгрузка данных...
                    </span>
                )}
                {allItems.length === 0 && !getFeedbacksQuery.isLoading && (
                    <span className="text-slate-400 text-sm">Все записи загружены</span>
                )}
            </div>
        </div>
    );
}
