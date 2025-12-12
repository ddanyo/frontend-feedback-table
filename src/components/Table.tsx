import { PaginatedTable } from './PaginatedTable';
import { DynamicTable } from './DynamicTable';
import { useSettings } from '../context/AppContext';

export function Table() {
    const { settings } = useSettings();
    if (settings.dynamicMode) {
        return (
            <div className="overflow-y-auto min-h-0 border-2 border-slate-200 rounded-lg">
                <DynamicTable />
            </div>
        );
    }

    return (
        <div className="h-full">
            <PaginatedTable />
        </div>
    );
}
