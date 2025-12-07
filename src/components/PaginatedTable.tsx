import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getFeedbacks } from '../api/feedbacks';
import { FeedbackSort } from '../constans/FeedbackSort';
import { type FeedbackResponse } from '../interfaces/Feedback';
import { NativeTable } from './NativeTable';
import { TanstackTable } from './TanstackTable';
import { PageSwitcher } from './PageSwitcher';

export function PaginatedTable({
    searchTerm,
    useTanstackTable,
    pageSettings,
    onPageSettingsChange,
}: {
    searchTerm: string;
    useTanstackTable: boolean;
    pageSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    };
    onPageSettingsChange: (newSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    }) => void;
}) {
    const queryParams = {
        skip: (pageSettings.page - 1) * pageSettings.pageSize,
        take: pageSettings.pageSize,
        search: searchTerm,
        sortBy: FeedbackSort.NEWEST,
    };

    const getFeedbacksQuery = useQuery<FeedbackResponse, Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: () => getFeedbacks(queryParams),
    });
    const data = getFeedbacksQuery.data;
    const items = data?.items || [];
    const totalPages = data?.totalPages || 0;
    const feedbackList = data?.items || [];

    useEffect(() => {
        if (totalPages !== pageSettings.countPages) {
            onPageSettingsChange({
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
        <div className="flex flex-col h-full gap-2">
            <div className="flex flex-col h-full overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white">
                {useTanstackTable ? (
                    <TanstackTable data={feedbackList} />
                ) : (
                    <NativeTable data={feedbackList} searchTerm={searchTerm} />
                )}
            </div>

            <div className="h-6 my-2">
                <PageSwitcher
                    pageSettings={pageSettings}
                    onPageSettingsChange={onPageSettingsChange}
                />
            </div>
        </div>
    );
}
