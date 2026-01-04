import { useEffect } from 'react';
import { useStore, useZustandStore } from '@store';
import { NativeVirtualZustand, TanstackVirtualZustand } from '@components';
import { pollingInterval } from '@constants';

export function DynamicTableZustand() {
    console.log('DynamicTableZustand');

    const { get } = useStore.Settings();

    const startPolling = useZustandStore((state) => state.startPolling);
    const stopPolling = useZustandStore((state) => state.stopPolling);

    useEffect(() => {
        startPolling(pollingInterval);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (get().tanstackVirtual) return <TanstackVirtualZustand />;
    return <NativeVirtualZustand />;
}
