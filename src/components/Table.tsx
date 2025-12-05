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
            return (
                <div className="flex flex-col h-full overflow-hidden border border-slate-200 rounded-lg bg-white">
                    <VirtualTable searchTerm={searchTerm} pageSize={pageSettings.pageSize} />
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full overflow-hidden border border-slate-200 rounded-lg bg-white">
                <div className="flex-1 overflow-y-auto min-h-0">
                    <DynamicTable
                        searchTerm={searchTerm}
                        pageSize={pageSettings.pageSize}
                        useTanstackTable={settings.tanstackTable}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden border border-slate-200 rounded-lg bg-white">
            <div className="overflow-y-auto min-h-0">
                <PaginatedTable
                    searchTerm={searchTerm}
                    pageSettings={pageSettings}
                    settings={settings}
                    onPageSettingsChange={onPageSettingsChange}
                />
            </div>
        </div>
    );
}
