import { PaginatedTableProvider } from './table/PaginatedTableProvider';
import { DynamicTableProvider } from './table/DynamicTableProvider';
import { useStore } from '../store/useStore';

export function Table() {
    console.log('Table');

    const { get } = useStore.Settings();

    if (get().dynamicMode) {
        return <DynamicTableProvider />;
    }

    return <PaginatedTableProvider />;
}
