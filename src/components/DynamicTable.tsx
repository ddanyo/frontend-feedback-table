import { useSettings } from '../context/AppContext';
import { TanstackVirtual } from '../components/TanstackVirtual';
import { NativeVirtual } from './NativeVirtual';

export function DynamicTable() {
    const { settings } = useSettings();

    return <>{settings.tanstackVirtual ? <TanstackVirtual /> : <NativeVirtual />}</>;
}
