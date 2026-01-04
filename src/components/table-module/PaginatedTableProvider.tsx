import { useStore } from '@store';
import { PaginatedTableApi, PaginatedTableZustand } from '@components';

export function PaginatedTableProvider() {
    console.log('PaginatedTable');

    const { get } = useStore.Settings();

    if (get().zustand) {
        return <PaginatedTableZustand />;
    }

    return <PaginatedTableApi />;
}
