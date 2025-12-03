import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '../api/feedbacks';
import { NativeTable } from './NativeTable';
import { FeedbackSort } from '../constans/FeedbackSort';
import { type Feedback } from '../interfaces/Feedback';
import { TanstackTable } from './TanstackTable';

export function Table({
    searchTerm,
    page,
    pageSize,
    settings,
}: {
    searchTerm: string;
    page: number;
    pageSize: number;
    settings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
    };
}) {
    const queryParams = {
        skip: (page - 1) * pageSize,
        take: pageSize,
        search: searchTerm,
        sortBy: FeedbackSort.NEWEST,
    };

    const getFeedbacksQuery = useQuery<Feedback[], Error>({
        queryKey: ['feedbacks', queryParams],
        queryFn: () => getFeedbacks(queryParams),
    });

    if (getFeedbacksQuery.isLoading) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium animate-pulse mt-20">
                Загрузка данных...
            </div>
        );
    }
    if (getFeedbacksQuery.isError)
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {getFeedbacksQuery.error.message}
            </div>
        );
    if (!getFeedbacksQuery.data || getFeedbacksQuery.data.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    const feedbackList = getFeedbacksQuery.data;

    return (
        <div className="flex flex-col max-h-full overflow-y-auto min-h-0 border border-slate-200 rounded-lg bg-white">
            {settings.tanstackTable ? (
                <TanstackTable data={feedbackList} />
            ) : (
                <NativeTable data={feedbackList} />
            )}
        </div>
    );
}
