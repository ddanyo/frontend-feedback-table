import { useStore } from '@store';
import { DynamicTableZustand, DynamicTableApi } from '@components';

export function DynamicTableProvider() {
    const { get } = useStore.Settings();

    if (get().zustand) {
        return <DynamicTableZustand />;
    }

    return <DynamicTableApi />;
}
