import { useStore } from '../../store/useStore';
import { DynamicTableZustand } from './zustand/DynamicTableZustand';
import { DynamicTableApi } from './api/DynamicTableApi';

export function DynamicTableProvider() {
    const { get } = useStore.Settings();

    if (get().zustand) {
        return <DynamicTableZustand />;
    }

    return <DynamicTableApi />;
}
