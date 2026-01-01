import { useStore } from '../../store/useStore';
import { PaginatedTableApi } from './api/PaginatedTableApi';
import { PaginatedTableZustand } from './zustand/PaginatedTableZustand';

export function PaginatedTableProvider() {
    console.log('PaginatedTable');

    const { get } = useStore.Settings();

    if (get().zustand) {
        return <PaginatedTableZustand />;
    }

    return <PaginatedTableApi />;
}
