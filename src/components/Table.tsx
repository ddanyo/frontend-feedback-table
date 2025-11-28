import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '../api/feedbacks';
import { type Feedback } from '../interfaces/Feedback';
import { FeedbackSort } from '../constans/FeedbackSort';

export function Table() {
    // const [page, setPage] = useState(0);
    // const pageSize = 10;

    // Вычисляем параметры
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

    if (getFeedbacksQuery.isLoading) return <span className="text-2xl">Loading...</span>;
    if (getFeedbacksQuery.isError)
        return <span className="text-2xl text-red-500">{getFeedbacksQuery.error.message}</span>;
    if (!getFeedbacksQuery.data || getFeedbacksQuery.data.length === 0) {
        return <span className="text-2xl">Нет данных для отображения.</span>;
    }

    const feedbackList = getFeedbacksQuery.data;

    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
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
                        <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm text-slate-500">#{item.id}</td>
                            <td className="px-6 py-4">
                                <span className="text-lg text-yellow-500">
                                    {item.rating >= 4 ? '★' : '☆'}
                                    <span className="text-sm text-slate-600 ml-2">
                                        ({item.rating})
                                    </span>
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{item.date_time}</td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                                {item.feedback_text}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
