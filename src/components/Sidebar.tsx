import { Switcher } from './Switcher';

export function Sidebar({
    settings,
    onSettingsChange,
}: {
    settings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
    };
    onSettingsChange: (newSettings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
    }) => void;
}) {
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
                            onSettingsChange({
                                ...settings,
                                tanstackTable: !settings.tanstackTable,
                            })
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">TanStack Virtual</span>
                    <Switcher
                        enabled={settings.tanstackVirtual}
                        onChange={() =>
                            onSettingsChange({
                                ...settings,
                                tanstackVirtual: !settings.tanstackVirtual,
                            })
                        }
                    />
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Zustand</span>
                    <Switcher
                        enabled={settings.zustand}
                        onChange={() =>
                            onSettingsChange({
                                ...settings,
                                zustand: !settings.zustand,
                            })
                        }
                    />
                </div>
            </div>
        </aside>
    );
}
