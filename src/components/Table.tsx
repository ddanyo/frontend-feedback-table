import { PaginatedTable } from './PaginatedTable';
import { DynamicTable } from './DynamicTable';
import { useSettings } from '../context/AppContext';

export function Table() {
    const { settings } = useSettings();
    if (settings.dynamicMode) {
        return (
            // <div className="overflow-y-auto min-h-0 border-2 border-red-200 rounded-lg">
            <div className="h-full">
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
