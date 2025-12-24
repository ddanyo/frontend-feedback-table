import { useSettings } from '../../context/AppContext';
import { PaginatedTableApi } from './api/PaginatedTableApi';
import { PaginatedTableZustand } from './zustand/PaginatedTableZustand';

export function PaginatedTable() {
    console.log('PaginatedTable');

    const { settings } = useSettings();

    if (settings.zustand) {
        return <PaginatedTableZustand />;
    }

    return <PaginatedTableApi />;
}
