import { MOCK_DATA } from '../constans/MockData';

export function Table() {
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
                            Текст
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {MOCK_DATA.map((item) => (
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
                            <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
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
