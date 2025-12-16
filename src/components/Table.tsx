import { PaginatedTable } from './PaginatedTable';
import { useSettings } from '../context/AppContext';
import { DynamicTable } from './virtual/DynamicTable';

export function Table() {
    const { settings } = useSettings();
    if (settings.dynamicMode) {
        return <DynamicTable />;
    }

    return <PaginatedTable />;
}
