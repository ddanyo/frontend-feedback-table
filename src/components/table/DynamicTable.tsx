import { useSettings } from '../../context/AppContext';
import { NativeVirtualApi } from './api/NativeVirtualApi';
import { TsVNativeTableApi } from './api/TsVNativeTableApi';
import { TsVTanstackTableApi } from './api/TsVTanstackTableApi';
import { TsVTanstackTableZustand } from './zustand/TsVTanstackTableZustand';
import { TsVNativeTableZustand } from './zustand/TsVNativeTableZustand';

export function DynamicTable() {
    const { settings } = useSettings();

    // if (settings.zustand) {
    //     if (settings.tanstackVirtual) {
    //         if (settings.tanstackTable) {
    //             return <TsVTanstackTableZustand />;
    //         }
    //         return <TsVNativeTableZustand />;
    //     }
    //     return;
    // } else {
    //     if (settings.tanstackVirtual) {
    //         if (settings.tanstackTable) {
    //             return <TsVTanstackTableApi />;
    //         }
    //         return <TsVNativeTableApi />;
    //     }
    //     return <NativeVirtualApi />;
    // }

    if (settings.tanstackVirtual) {
        if (settings.tanstackTable) {
            return <>{settings.zustand ? <TsVTanstackTableZustand /> : <TsVTanstackTableApi />}</>;
        }
        return <>{settings.zustand ? <TsVNativeTableZustand /> : <TsVNativeTableApi />}</>;
    }
    return <NativeVirtualApi />;
}
