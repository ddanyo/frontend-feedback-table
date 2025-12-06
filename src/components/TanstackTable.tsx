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
                cell: (props) => `#${props.getValue()}`,
            }),
            columnHelper.accessor('rating', {
                header: 'Рейтинг',
                cell: (props) => {
                    const rating = props.getValue();
                    const colorClass =
                        rating === 5
                            ? 'text-green-500'
                            : rating === 1
                              ? 'text-red-500'
                              : 'text-yellow-500';
                    return (
                        <span className={`flex items-center justify-center ${colorClass}`}>
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
                cell: (props) => formatClockString(new Date(props.getValue())),
            }),
            columnHelper.accessor('feedback_text', {
                header: 'Текст отзыва',
                cell: (props) => (
                    <span className="text-slate-600 font-medium">{props.getValue()}</span>
                ),
            }),
        ];
    }, []);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <table className="w-full divide-y divide-slate-100 relative table-fixed">
            <thead className="bg-blue-100 table-fixed sticky top-0 z-10 shadow-sm h-12">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className={`text-center text-sm font-medium text-slate-500 uppercase ${
                                    header.id === 'feedback_text'
                                        ? 'w-[60%]'
                                        : header.id === 'date_time'
                                          ? 'w-[20%]'
                                          : 'w-[10%]'
                                }`}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-100">
                        {row.getAllCells().map((cell) => (
                            <td
                                key={cell.id}
                                className={`p-3 text-slate-500 ${cell.column.id === 'feedback_text' ? 'text-base text-slate-600 font-medium text-left' : 'text-center text-sm'}`}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
