import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getFeedbacks } from '../../../api/feedbacks';
import { FeedbackSort } from '../../../constans/FeedbackSort';
import { type FeedbackResponse } from '../../../interfaces/Feedback';
import { useStore } from '../../../store/useStore';
import { PaginatedTable } from '../PaginatedTable';

export function PaginatedTableApi() {
    console.log('PaginatedTable');

    const { get: getPageSettings } = useStore.PageSettings();
    const { get: getSearchSettings } = useStore.SearchSettings();

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
        queryFn: async ({ signal }) => {
            return await getFeedbacks(queryParams, signal);
        },
        placeholderData: keepPreviousData,
    });
    const { data, error, isError, isLoading } = getFeedbacksQuery;

    const items = useMemo(() => data?.items || [], [data]);
    const totalPages = useMemo(() => data?.totalPages || 0, [data]);

    return (
        <PaginatedTable
            items={items}
            error={error?.message || ''}
            isError={isError}
            isLoading={isLoading}
            totalPages={totalPages}
        />
    );
}
