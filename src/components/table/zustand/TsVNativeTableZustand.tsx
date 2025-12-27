import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { StarIcon } from '../../icons/StarIcon';
import { formatClockString } from '../../../utils/formatClockString';
import { getHighlightedText } from '../../../utils/highlight';
import useAppStore from '../../../store/useZustandStore';
import { useStore } from '../../../store/useStore';

export function TsVNativeTableZustand() {
    console.log('TVNativeTableZustand');

    const { get } = useStore.SearchSettings();

    const allItems = useAppStore((state) => state.allItems);
    const searchResults = useAppStore((state) => state.searchResults);

    const items = useMemo(
        () => (searchResults.length > 0 ? searchResults : allItems),
        [searchResults, allItems]
    );

    const tableContainerRef = useRef<HTMLDivElement>(null);

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
            <table className="divide-y divide-slate-100 relative table-fixed">
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
                <tbody
                    className="bg-white divide-y divide-slate-200"
                    style={{ contain: 'layout paint' }}
                >
                    {paddingTop > 0 && (
                        <tr>
                            <td style={{ height: `${paddingTop}px` }} colSpan={4} />
                        </tr>
                    )}

                    {virtualItems.map((virtualRow) => {
                        const item = items[virtualRow.index];
                        if (!item) return null;

                        return (
                            <tr
                                key={virtualRow.key}
                                ref={virtualizer.measureElement}
                                data-index={virtualRow.index}
                                className="hover:bg-slate-100"
                            >
                                <td className="text-center p-3 text-sm text-slate-500">
                                    #{item.id}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={`flex items-center justify-center ${
                                            item.rating === 5
                                                ? 'text-green-500'
                                                : item.rating === 1
                                                  ? 'text-red-500'
                                                  : 'text-yellow-500'
                                        }`}
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
