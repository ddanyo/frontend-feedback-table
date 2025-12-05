import { useEffect, useState } from 'react';
import { Switcher } from './Switcher';

export function Sidebar({
    settings,
    onSettingsChange,
    pageSettings,
    onPageSettingsChange,
}: {
    settings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
        dynamicMode: boolean;
    };
    onSettingsChange: (newSettings: {
        tanstackTable: boolean;
        tanstackVirtual: boolean;
        zustand: boolean;
        dynamicMode: boolean;
    }) => void;
    pageSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    };
    onPageSettingsChange: (newSettings: {
        page: number;
        pageSize: number;
        countPages: number;
    }) => void;
}) {
    const [localPage, setLocalPage] = useState<string>(pageSettings.page.toString());
    useEffect(() => {
        const newPageStr = pageSettings.page.toString();

        if (localPage !== newPageStr) {
            setLocalPage(newPageStr);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSettings.page]);

    const [localPageSize, setLocalPageSize] = useState<string>(pageSettings.pageSize.toString());

    useEffect(() => {
        const newSizeStr = pageSettings.pageSize.toString();

        if (localPageSize !== newSizeStr) {
            setLocalPageSize(newSizeStr);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSettings.pageSize]);

    function handleDecreasePageSize() {
        if (pageSettings.pageSize >= 10) {
            onPageSettingsChange({ ...pageSettings, pageSize: pageSettings.pageSize - 5 });
        }
        if (pageSettings.pageSize - 5 < 5) {
            onPageSettingsChange({ ...pageSettings, pageSize: 5 });
        }
    }
    function handleIncreasePageSize() {
        if (pageSettings.pageSize <= 95) {
            onPageSettingsChange({ ...pageSettings, pageSize: pageSettings.pageSize + 5 });
        }
        if (pageSettings.pageSize + 5 > 100) {
            onPageSettingsChange({ ...pageSettings, pageSize: 100 });
        }
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalPageSize(val);

        if (val === '') return;

        const numVal = parseInt(val, 10);

        if (!isNaN(numVal) && numVal >= 5 && numVal <= 100) {
            onPageSettingsChange({ ...pageSettings, pageSize: numVal });
        }
    };

    const handlePageSizeBlur = () => {
        let numVal = parseInt(localPageSize, 10);

        if (isNaN(numVal) || numVal < 5) {
            setLocalPageSize(pageSettings.pageSize.toString());
            return;
        }

        if (numVal > 100) {
            numVal = 100;
        }

        if (numVal !== pageSettings.pageSize) {
            onPageSettingsChange({ ...pageSettings, pageSize: numVal });
        }
        setLocalPageSize(numVal.toString());
    };

    return (
        <aside className="flex flex-col w-70 bg-slate-50 border-r-3 border-slate-200 p-5 h-full overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-500 mb-4 text-lg font-bold">
                <span>⚙️</span>
                Settings
            </div>

            <div className="flex flex-col flex-1 gap-1.5">
                <span className="text-sm font-medium text-slate-500">Режим таблицы</span>
                <div
                    className={`flex items-center justify-between transition ${settings.tanstackVirtual ? 'opacity-40 pointer-events-none' : ''}`}
                >
                    <span className="text-base font-medium text-slate-700 pl-3">
                        TanStack Table
                    </span>
                    <Switcher
                        enabled={settings.tanstackTable}
                        onChange={() => {
                            onSettingsChange({
                                ...settings,
                                tanstackTable: !settings.tanstackTable,
                            });
                            console.log('Изменились настройки: ', settings);
                        }}
                    />
                </div>

                <span className="text-sm font-medium text-slate-500 mt-4">
                    Динамическая таблица
                </span>
                <div className="flex items-center justify-between pl-3">
                    <span className="text-base font-medium text-slate-700">Dynamic Mode</span>
                    <Switcher
                        enabled={settings.dynamicMode}
                        onChange={() => {
                            const isDynamicMode = !settings.dynamicMode;
                            onSettingsChange({
                                ...settings,
                                dynamicMode: isDynamicMode,
                                tanstackVirtual: isDynamicMode ? settings.tanstackVirtual : false,
                            });
                            console.log('Изменились настройки: ', settings);
                        }}
                    />
                </div>

                <div
                    className={`flex items-center justify-between transition ${!settings.dynamicMode ? 'opacity-40 pointer-events-none' : ''}`}
                >
                    <span className="text-base font-medium text-slate-700 pl-3">
                        TanStack Virtual
                    </span>
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

                <span className="text-sm font-medium text-slate-500 mt-4">Режим подгрузки</span>
                <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-slate-700 pl-3">Zustand</span>
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

            {!settings.dynamicMode ? (
                <div className="flex flex-col items-center justify-center h-30 rounded-lg p-3 gap-1 border-3 border-dashed border-slate-300 mb-10">
                    <span className="text-slate-700 text-base font-medium">
                        Число записей на странице:
                    </span>

                    <div className="flex items-center justify-center gap-2 bg-none h-1/2 w-full rounded-lg">
                        <button
                            onClick={handleDecreasePageSize}
                            disabled={pageSettings.pageSize === 5}
                            className="text-blue-500 text-4xl pb-2 pr-1 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            –
                        </button>
                        <input
                            type="number"
                            min={5}
                            max={100}
                            value={localPageSize}
                            onChange={handlePageSizeChange}
                            onBlur={handlePageSizeBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handlePageSizeBlur();
                                    (e.target as HTMLInputElement).blur();
                                }
                            }}
                            className="w-14 h-7 text-center text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 no-spinner"
                        />
                        <button
                            onClick={handleIncreasePageSize}
                            disabled={pageSettings.pageSize === 100}
                            className="text-blue-500 text-4xl pb-2 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            +
                        </button>
                    </div>
                </div>
            ) : null}
        </aside>
    );
}
