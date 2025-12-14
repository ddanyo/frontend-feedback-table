import { StarIcon } from '../components/icons/StarIcon';
import { type Feedback } from '../interfaces/Feedback';
import { getHighlightedText } from '../utils/highlight';
import { useSettings } from '../context/AppContext';
import { Virtualizer } from '@tanstack/react-virtual';

export function NativeTable({
    data,
    virtualizer,
}: {
    data: Feedback[];
    virtualizer?: Virtualizer<HTMLDivElement, Element>;
}) {
    const { searchSettings } = useSettings();

    const formatClockString = (date: Date): string => {
        if (isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            weekday: 'long',
        }).format(date);
    };
    const virtualItems = virtualizer?.getVirtualItems() ?? [];

    const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
    const paddingBottom =
        virtualItems.length > 0
            ? (virtualizer?.getTotalSize() ?? 0) - virtualItems[virtualItems.length - 1].end
            : 0;

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
            <tbody
                className="bg-white divide-y divide-slate-200"
                style={{ contain: 'layout paint' }}
            >
                {virtualizer && paddingTop > 0 && (
                    <tr>
                        <td style={{ height: `${paddingTop}px` }} colSpan={4} />
                    </tr>
                )}

                {virtualizer
                    ? virtualItems.map((virtualRow) => {
                          const item = data[virtualRow.index];
                          if (!item) return null;

                          return (
                              <tr
                                  key={virtualRow.key}
                                  data-index={virtualRow.index}
                                  ref={virtualizer.measureElement}
                                  className="hover:bg-slate-100"
                              >
                                  <td className="text-center p-3 text-sm text-slate-500">
                                      #{item.id}
                                  </td>
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
                                          searchSettings.searchTerm,
                                          searchSettings.caseSensitive,
                                          searchSettings.wholeWord
                                      )}
                                  </td>
                              </tr>
                          );
                      })
                    : data.map((item) => (
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
                                      searchSettings.searchTerm,
                                      searchSettings.caseSensitive,
                                      searchSettings.wholeWord
                                  )}
                              </td>
                          </tr>
                      ))}

                {virtualizer && paddingBottom > 0 && (
                    <tr>
                        <td style={{ height: `${paddingBottom}px` }} colSpan={4} />
                    </tr>
                )}
            </tbody>
        </table>
    );
}
