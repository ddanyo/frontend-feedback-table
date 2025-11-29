import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '../api/feedbacks';
import { type Feedback } from '../interfaces/Feedback';
import { FeedbackSort } from '../constans/FeedbackSort';
import { StarIcon } from '../components/icons/StarIcon';

export function Table() {
    // const [page, setPage] = useState(0);
    // const pageSize = 10;

    const queryParams = {
        skip: 0, // page * pageSize,
        take: 5, // pageSize,
        search: 'н',
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
    const formatClockString = (date: Date): string => {
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'long',
        }).format(date);
    };

    return (
        <div className="flex flex-col max-h-full overflow-y-auto min-h-0 border border-slate-200 rounded-lg bg-white">
            <table className="w-full divide-y divide-slate-200 relative">
                <thead className="bg-slate-100 table-fixed sticky top-0 z-10 shadow-sm">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            Рейтинг
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                            Дата
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">
                            Текст отзыва
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {feedbackList.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-100">
                            <td className="px-6 py-4 text-sm text-slate-500">#{item.id}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`flex items-center ${item.rating === 5 ? 'text-green-500' : item.rating === 1 ? 'text-red-500' : 'text-yellow-500'}`}
                                >
                                    <StarIcon className="w-5 h-5" />
                                    <span className="text-sm  text-slate-500 font-medium ml-2">
                                        {item.rating}
                                    </span>
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                                {formatClockString(new Date(item.date_time))}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                {item.feedback_text}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
