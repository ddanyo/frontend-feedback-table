import { PaginatedTableProvider, DynamicTableProvider } from '@components';
import { useStore } from '@store';

export function Table() {
    console.log('Table');

    const { get } = useStore.Settings();

    if (get().dynamicMode) {
        return <DynamicTableProvider />;
    }

    return <PaginatedTableProvider />;
}
