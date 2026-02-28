import { useStore } from '@store';
import { NativeVirtualApi, TanstackVirtualApi } from '@components';

export function DynamicTableApi() {
    const { get } = useStore.Settings();

    if (get().tanstackVirtual) return <TanstackVirtualApi />;
    return <NativeVirtualApi />;
}
