import { useEffect, useState } from 'react';
import { Switcher } from './Switcher';

export function Sidebar() {
    const [settings, setSettings] = useState({
        tanstackTable: false,
        tanstackVirtual: false,
        zustand: false,
    });

    useEffect(() => {}, [settings]);

    return (
        <aside className="w-64 bg-slate-50 border-r-3 border-slate-200 p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-500 mb-6 text-md font-bold tracking-wider">
                <span>⚙️</span>
                Settings
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">TanStack Table</span>
                    <Switcher
                        enabled={settings.tanstackTable}
                        onChange={() =>
                            setSettings((s) => ({ ...s, tanstackTable: !s.tanstackTable }))
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">TanStack Virtual</span>
                    <Switcher
                        enabled={settings.tanstackVirtual}
                        onChange={() =>
                            setSettings((s) => ({ ...s, tanstackVirtual: !s.tanstackVirtual }))
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Zustand</span>
                    <Switcher
                        enabled={settings.zustand}
                        onChange={() => setSettings((s) => ({ ...s, zustand: !s.zustand }))}
                    />
                </div>
            </div>
        </aside>
    );
}
