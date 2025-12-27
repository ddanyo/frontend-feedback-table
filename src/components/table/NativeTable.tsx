import { StarIcon } from '../icons/StarIcon';
import { type Feedback } from '../../interfaces/Feedback';
import { getHighlightedText } from '../../utils/highlight';
import { formatClockString } from '../../utils/formatClockString';
import { useStore } from '../../store/useStore';

export function NativeTable({ data }: { data: Feedback[] }) {
    console.log('NativeTable');

    const { get } = useStore.SearchSettings();

    return (
        <table className="w-full divide-y divide-slate-100 relative table-fixed">
            <thead className="bg-slate-100 table-fixed sticky top-0 z-10 shadow-sm h-12">
                <tr>
                    <th className="text-center text-sm font-medium text-slate-500 uppercase w-[10%]">
                        ID
                    </th>
                    <th className="text-center text-sm font-medium text-slate-500 uppercase w-[10%]">
                        Рейтинг
                    </th>
                    <th className="text-center text-sm font-medium text-slate-500 uppercase w-[20%]">
                        Дата
                    </th>
                    <th className="text-center text-sm font-medium text-slate-500 uppercase w-[60%]">
                        Текст отзыва
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {data.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-100">
                        <td className="text-center p-3 text-sm text-slate-500">#{item.id}</td>
                        <td className="p-3">
                            <span
                                className={`flex items-center justify-center ${item.rating === 5 ? 'text-green-500' : item.rating === 1 ? 'text-red-500' : 'text-yellow-500'}`}
                            >
                                <StarIcon className="w-5 h-5" />
                                <span className="text-sm text-slate-500 font-medium ml-2">
                                    {item.rating}
                                </span>
                            </span>
                        </td>
                        <td className="text-center p-3 text-sm text-slate-500">
                            {formatClockString(new Date(item.date_time))}
                        </td>
                        <td className="text-left p-3 text-slate-600 text-base font-medium wrap-break-word whitespace-pre-wrap">
                            {getHighlightedText(
                                item.feedback_text,
                                get().searchTerm,
                                get().caseSensitive,
                                get().wholeWord
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
