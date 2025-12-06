import { PaginatedTable } from './PaginatedTable';
import { DynamicTable } from './DynamicTable';
import { VirtualTable } from './VirtualTable';

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
        if (settings.tanstackVirtual) {
            return <VirtualTable searchTerm={searchTerm} pageSize={pageSettings.pageSize} />;
        }

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
                settings={settings}
                onPageSettingsChange={onPageSettingsChange}
            />
        </div>
    );
}
