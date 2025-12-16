import { useSettings } from '../../context/AppContext';
import { NativeVirtual } from './NativeVirtual';
import { TVNativeTable } from './TsVNativeTable';
import { TVTanstackTable } from './TsVTanstackTable';

export function DynamicTable() {
    const { settings } = useSettings();

    if (settings.tanstackVirtual) {
        if (settings.tanstackTable) {
            return <TVTanstackTable />;
        }
        return <TVNativeTable />;
    }
    return <NativeVirtual />;
}
