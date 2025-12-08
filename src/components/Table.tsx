import { PaginatedTable } from './PaginatedTable';
import { DynamicTable } from './DynamicTable';

export function Table({
    searchTerm,
    settings,
    pageSettings,
    onPageSettingsChange,
}: {
    searchTerm: string;
    settings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
        dynamicMode: boolean;
    };
    pageSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    };
    onPageSettingsChange: (newSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    }) => void;
}) {
    if (settings.dynamicMode) {
        return (
            <div className="overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg">
                <DynamicTable
                    searchTerm={searchTerm}
                    pageSize={pageSettings.pageSize}
                    useTanstackTable={settings.tanstackTable}
                />
            </div>
        );
    }

    return (
        <div className="h-full">
            <PaginatedTable
                searchTerm={searchTerm}
                pageSettings={pageSettings}
                useTanstackTable={settings.tanstackTable}
                onPageSettingsChange={onPageSettingsChange}
            />
        </div>
    );
}
