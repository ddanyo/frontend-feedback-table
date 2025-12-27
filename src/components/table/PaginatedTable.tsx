import { NativeTable } from './NativeTable';
import { TanstackTable } from './TanstackTable';
import { PageSwitcher } from '../PageSwitcher';
import { useStore } from '../../store/useStore';
import type { Feedback } from '../../interfaces/Feedback';

export function PaginatedTable({
    items,
    error,
    isError,
    isLoading,
    totalPages,
}: {
    items: Feedback[];
    error: string;
    isError: boolean;
    isLoading: boolean;
    totalPages: number;
}) {
    console.log('PaginatedTable');
    const { get: getSettings } = useStore.Settings();

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
                {getSettings().tanstackTable ? (
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
