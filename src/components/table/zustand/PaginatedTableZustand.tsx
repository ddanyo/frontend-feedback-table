import { useMemo } from 'react';
import { NativeTable } from '../NativeTable';
import { TanstackTable } from '../TanstackTable';
import { PageSwitcher } from '../../PageSwitcher';
import { useSettings } from '../../../context/AppContext';
import useAppStore from '../../../store/useAppStore';

export function PaginatedTableZustand() {
    console.log('PaginatedTableZustand');

    const { pageSettings, settings } = useSettings();

    const { getPage, isLoading, isError, error } = useAppStore.getState();
    const { items, totalPages } = useMemo(
        () => getPage(pageSettings.page, pageSettings.pageSize),
        [getPage, pageSettings.page, pageSettings.pageSize]
    );

    if (isLoading) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium animate-pulse mt-20">
                Загрузка данных...
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex justify-center text-xl text-red-500 font-medium mt-20">
                {error}
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex justify-center text-xl text-slate-500 font-medium mt-20">
                Нет данных для отображения...
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between h-full gap-2">
            <div className="flex flex-col overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg bg-white">
                {settings.tanstackTable ? (
                    <TanstackTable data={items} />
                ) : (
                    <NativeTable data={items} />
                )}
            </div>
            <div className="h-6 my-2">
                <PageSwitcher countPages={totalPages} />
            </div>
        </div>
    );
}
