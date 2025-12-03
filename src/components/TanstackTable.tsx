import { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { type Feedback } from '../interfaces/Feedback';
import { StarIcon } from '../components/icons/StarIcon';

export function TanstackTable({ data }: { data: Feedback[] }) {
    'use no memo';
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

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<Feedback>();

        return [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: (info) => `#${info.getValue()}`,
            }),
            columnHelper.accessor('rating', {
                header: 'Рейтинг',
                cell: (info) => {
                    const rating = info.getValue();
                    const colorClass =
                        rating === 5
                            ? 'text-green-500'
                            : rating === 1
                              ? 'text-red-500'
                              : 'text-yellow-500';
                    return (
                        <span className={`flex items-center ${colorClass}`}>
                            <StarIcon className="w-5 h-5" />
                            <span className="text-sm text-slate-500 font-medium ml-2">
                                {rating}
                            </span>
                        </span>
                    );
                },
            }),
            columnHelper.accessor('date_time', {
                header: 'Дата',
                cell: (info) => formatClockString(new Date(info.getValue())),
            }),
            columnHelper.accessor('feedback_text', {
                header: 'Текст отзыва',
                cell: (info) => (
                    <span className="text-slate-600 font-medium">{info.getValue()}</span>
                ),
            }),
        ];
    }, []);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="w-full divide-y divide-slate-200 relative">
            <thead className="bg-blue-200 table-fixed sticky top-0 z-10 shadow-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase ${
                                    header.id === 'feedback_text' ? 'w-1/2' : ''
                                }`}
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                      )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100">
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-4 text-sm text-slate-500">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
