import { PaginatedTable } from './table/PaginatedTableProvider';
import { DynamicTable } from './table/DynamicTable';
import { useStore } from '../store/useStore';

export function Table() {
    console.log('Table');

    const { get } = useStore.Settings();

    if (get().dynamicMode) {
        return <DynamicTable />;
    }

    return <PaginatedTable />;
}
