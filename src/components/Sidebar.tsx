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

    const [isOpen, setIsOpen] = useState(false);

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
        <aside
            className={`
                flex flex-col items-center h-[90%] mt-8 ml-4
                transition-all duration-300 ease-in-out relative
                ${isOpen ? 'w-80 bg-slate-50 border-2 border-slate-200 rounded-2xl' : 'w-20 bg-white'}
            `}
        >
            <div className="flex flex-col flex-1 w-full items-center mb-4 overflow-hidden">
                <div
                    className={`
                    absolute top-4 left-0 w-full flex justify-center 
                    transition-opacity duration-200 z-10
                    ${!isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
                `}
                >
                    <button
                        onClick={() => setIsOpen(true)}
                        className="p-2 rounded-xl bg-slate-200 text-xl cursor-pointer transition hover:bg-slate-300"
                        title="Открыть настройки"
                    >
                        ⚙️
                    </button>
                </div>

                <div
                    className={`
                    flex flex-col h-full w-80 min-w-[300px]
                    transition-opacity duration-200 
                    /* ВАЖНО: overflow-y-auto перенесен СЮДА. Теперь скроллится весь контейнер целиком */
                    overflow-y-auto overflow-x-hidden
                    ${isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
                `}
                >
                    <div className="flex flex-col min-h-full p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-500 text-xl font-bold ml-1">
                                <span>⚙️</span>
                                <span>Настройки</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-xl transition-colors cursor-pointer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-8">
                            <span className="text-sm font-medium text-slate-500">
                                Режим таблицы
                            </span>
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
                                    }}
                                />
                            </div>

                            <span className="text-sm font-medium text-slate-500 mt-4">
                                Динамическая таблица
                            </span>
                            <div className="flex items-center justify-between pl-3">
                                <span className="text-base font-medium text-slate-700">
                                    Dynamic Mode
                                </span>
                                <Switcher
                                    enabled={settings.dynamicMode}
                                    onChange={() => {
                                        const isDynamicMode = !settings.dynamicMode;
                                        onSettingsChange({
                                            ...settings,
                                            dynamicMode: isDynamicMode,
                                            tanstackVirtual: isDynamicMode
                                                ? settings.tanstackVirtual
                                                : false,
                                        });
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

                            <span className="text-sm font-medium text-slate-500 mt-4">
                                Режим подгрузки
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-base font-medium text-slate-700 pl-3">
                                    Zustand
                                </span>
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
                            <div
                                className="
                                flex flex-col items-center justify-center 
                                w-full rounded-lg p-3 gap-2 
                                border-2 border-dashed border-slate-300 
                                mt-auto pt-4
                            "
                            >
                                <span className="text-sm font-medium text-slate-500">
                                    Число записей на странице:
                                </span>

                                <div className="flex items-center justify-center gap-2 bg-none h-1/2 rounded-lg">
                                    <button
                                        onClick={handleDecreasePageSize}
                                        disabled={pageSettings.pageSize === 5}
                                        className="flex items-center justify-center text-blue-500 p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 12h-15"
                                            />
                                        </svg>
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
                                        className="flex items-center justify-center text-blue-500 p-1 hover:bg-slate-100 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4.5v15m7.5-7.5h-15"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </aside>
    );
}
