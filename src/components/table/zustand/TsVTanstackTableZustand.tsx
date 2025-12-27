import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { Feedback } from '../../../interfaces/Feedback';
import { StarIcon } from '../../icons/StarIcon';
import { formatClockString } from '../../../utils/formatClockString';
import { getHighlightedText } from '../../../utils/highlight';
import useAppStore from '../../../store/useZustandStore';
import { useStore } from '../../../store/useStore';

const FeedbackTextCell = ({ text }: { text: string }) => {
    const { get } = useStore.SearchSettings();

    return (
        <span className="text-slate-600 font-medium">
            {getHighlightedText(text, get().searchTerm, get().caseSensitive, get().wholeWord)}
        </span>
    );
};

export function TsVTanstackTableZustand() {
    console.log('TVTanstackTableZustand');

    const allItems = useAppStore((state) => state.allItems);
    const searchResults = useAppStore((state) => state.searchResults);

    const items = useMemo(
        () => (searchResults.length > 0 ? searchResults : allItems),
        [searchResults, allItems]
    );

    const tableContainerRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line react-hooks/incompatible-library
    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => 60,
        overscan: 10,
    });

    const virtualItems = virtualizer.getVirtualItems();

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
            : 0;

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
                cell: (props) => <FeedbackTextCell text={props.getValue() ?? ''} />,
            }),
        ];
    }, []);

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    if (items.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    return (
        <div
            ref={tableContainerRef}
            className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white"
        >
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
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} colSpan={4} />
                        </tr>
                    )}

                    {virtualItems.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        if (!row) return null;

                        return (
                            <tr
                                key={row.id}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className="hover:bg-slate-100"
                            >
                                {row.getAllCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className={`p-3 text-slate-500 ${
                                            cell.column.id === 'feedback_text'
                                                ? 'text-base text-slate-600 font-medium text-left'
                                                : 'text-center text-sm'
                                        }`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}

                    {paddingBottom > 0 && (
                        <tr>
                            <td style={{ height: `${paddingBottom}px` }} colSpan={4} />
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="min-h-10 flex justify-center items-center w-full my-2">
                <span className="text-slate-400 text-sm font-medium">Все записи загружены</span>
            </div>
        </div>
    );
}
