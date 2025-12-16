import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getFeedbacks } from '../api/feedbacks';
import { FeedbackSort } from '../constans/FeedbackSort';
import { type FeedbackResponse } from '../interfaces/Feedback';
import { NativeTable } from './NativeTable';
import { TanstackTable } from './TanstackTable';
import { PageSwitcher } from './pagination/PageSwitcher';
import { useSettings } from '../context/AppContext';

export function PaginatedTable() {
    const { pageSettings, setPageSettings, searchSettings, settings } = useSettings();
    const queryParams = {
        skip: (pageSettings.page - 1) * pageSettings.pageSize,
        take: pageSettings.pageSize,
        search: searchSettings.searchTerm,
        sortBy: FeedbackSort.NEWEST,
        caseSensitive: searchSettings.caseSensitive,
        wholeWord: searchSettings.wholeWord,
    };

    const getFeedbacksQuery = useQuery<FeedbackResponse, Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: () => getFeedbacks(queryParams),
        placeholderData: keepPreviousData,
    });
    const data = getFeedbacksQuery.data;
    const items = data?.items || [];
    const totalPages = data?.totalPages || 0;

    useEffect(() => {
        if (totalPages !== pageSettings.countPages) {
            setPageSettings({
                ...pageSettings,
                countPages: totalPages,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages, pageSettings.countPages]);

    if (getFeedbacksQuery.isLoading) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium animate-pulse mt-20">
                Загрузка данных...
            </div>
        );
    }
    if (getFeedbacksQuery.isError) {
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {getFeedbacksQuery.error.message}
            </div>
        );
    }

    if (!data || items.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between h-full gap-2">
            <div className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white">
                {settings.tanstackTable ? (
                    <TanstackTable data={items} />
                ) : (
                    <NativeTable data={items} />
                )}
            </div>

            <div className="h-6 my-2">
                <PageSwitcher />
            </div>
        </div>
    );
}
