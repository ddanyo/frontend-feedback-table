import { NativeVirtualApi } from './api/NativeVirtualApi';
import { TsVNativeTableApi } from './api/TsVNativeTableApi';
import { TsVTanstackTableApi } from './api/TsVTanstackTableApi';
import { TsVTanstackTableZustand } from './zustand/TsVTanstackTableZustand';
import { TsVNativeTableZustand } from './zustand/TsVNativeTableZustand';
import { useStore } from '../../store/useStore';

export function DynamicTable() {
    const { get } = useStore.Settings();

    if (get().tanstackVirtual) {
        if (get().tanstackTable) {
            return <>{get().zustand ? <TsVTanstackTableZustand /> : <TsVTanstackTableApi />}</>;
        }
        return <>{get().zustand ? <TsVNativeTableZustand /> : <TsVNativeTableApi />}</>;
    }
    return <NativeVirtualApi />;
}
