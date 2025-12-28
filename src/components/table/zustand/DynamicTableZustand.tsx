import { useEffect } from 'react';
import { useStore } from '../../../store/useStore';
import { NativeVirtualZustand } from './NativeVirtualZustand';
import { TanstackVirtualZustand } from './TanstackVirtualZustand';
import useZustandStore from '../../../store/useZustandStore';
import { pollingInterval } from '../../../constans/ZustandConfig';

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
