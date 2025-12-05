import { StarIcon } from '../components/icons/StarIcon';
import { type Feedback } from '../interfaces/Feedback';
import { getHighlightedText } from '../utils/highlight';

export function NativeTable({ data, searchTerm }: { data: Feedback[]; searchTerm: string }) {
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
        <table className="w-full divide-y divide-slate-100 relative table-fixed">
            <thead className="bg-slate-100 table-fixed sticky top-0 z-10 shadow-sm h-12">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase w-[10%]">
                        ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase w-[10%]">
                        Рейтинг
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase w-[20%]">
                        Дата
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-500 uppercase w-[60%]">
                        Текст отзыва
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-100">
                        <td className="px-6 py-4 text-sm text-slate-500">#{item.id}</td>
                        <td className="px-6 py-4">
                            <span
                                className={`flex items-center ${item.rating === 5 ? 'text-green-500' : item.rating === 1 ? 'text-red-500' : 'text-yellow-500'}`}
                            >
                                <StarIcon className="w-5 h-5" />
                                <span className="text-sm text-slate-500 font-medium ml-2">
                                    {item.rating}
                                </span>
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                            {formatClockString(new Date(item.date_time))}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium wrap-break-word whitespace-pre-wrap">
                            {getHighlightedText(item.feedback_text, searchTerm)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
