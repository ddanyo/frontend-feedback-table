import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFeedbacks } from '../../../api/feedbacks';
import { FeedbackSort } from '../../../constans/FeedbackSort';
import { type FeedbackResponse } from '../../../interfaces/Feedback';
import { NativeTable } from '../NativeTable';
import { TanstackTable } from '../TanstackTable';
import { PageSwitcher } from '../../PageSwitcher';
import { useStore } from '../../../store/useStore';

export function PaginatedTableApi() {
    console.log('PaginatedTable');

    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();
    const { get: getSettings } = useStore.Settings();
    const queryParams = useMemo(
        () => ({
            skip: (getPageSettings().page - 1) * getPageSettings().pageSize,
            take: getPageSettings().pageSize,
            search: getSearchSettings().searchTerm,
            sortBy: FeedbackSort.NEWEST,
            caseSensitive: getSearchSettings().caseSensitive,
            wholeWord: getSearchSettings().wholeWord,
        }),
        [getPageSettings, getSearchSettings]
    );

    const getFeedbacksQuery = useQuery<FeedbackResponse, Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: () => getFeedbacks(queryParams),
        placeholderData: keepPreviousData,
    });
    const { data, error, isError, isLoading } = getFeedbacksQuery;

    const items = useMemo(() => data?.items || [], [data]);
    const totalPages = useMemo(() => data?.totalPages || 0, [data]);

    if (isLoading) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium animate-pulse mt-20">
                Загрузка данных...
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error.message}
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
                {getSettings().tanstackTable ? (
                    <TanstackTable data={items} />
                ) : (
                    <NativeTable data={items} />
                )}
            </div>

            <div className="h-6 my-2">
                <PageSwitcher countPages={totalPages} />
            </div>
        </div>
    );
}
