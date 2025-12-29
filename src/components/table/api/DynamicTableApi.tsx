import { useStore } from '../../../store/useStore';
import { NativeVirtualApi } from './NativeVirtualApi';
import { TanstackVirtualApi } from './TanstackVirtualApi';

export function DynamicTableApi() {
    const { get } = useStore.Settings();

    if (get().tanstackVirtual) return <TanstackVirtualApi />;
    return <NativeVirtualApi />;
}
