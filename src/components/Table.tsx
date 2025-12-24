import { PaginatedTable } from './table/PaginatedTable';
import { useSettings } from '../context/AppContext';
import { DynamicTable } from './table/DynamicTable';

export function Table() {
    console.log('Table');

    const { settings } = useSettings();
    if (settings.dynamicMode) {
        return <DynamicTable />;
    }

    return <PaginatedTable />;
}
