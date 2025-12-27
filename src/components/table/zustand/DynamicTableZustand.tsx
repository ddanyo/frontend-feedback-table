import { useStore } from '../../../store/useStore';
import { NativeVirtualZustand } from './NativeVirtualZustand';
import { TanstackVirtualZustand } from './TanstackVirtualZustand';

export function DynamicTableZustand() {
    const { get } = useStore.Settings();

    if (get().tanstackVirtual) return <TanstackVirtualZustand />;
    return <NativeVirtualZustand />;
}
