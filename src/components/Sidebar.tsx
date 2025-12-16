import { useEffect, useState } from 'react';
import { Switcher } from './Switcher';
import { Settings, X, Menu, Plus, Minus } from 'lucide-react';
import { useSettings } from '../context/AppContext';

export function Sidebar() {
    const { pageSettings, setPageSettings, settings, setSettings } = useSettings();
    const [localPageSize, setLocalPageSize] = useState<string>(pageSettings.pageSize.toString());
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPageSize(pageSettings.pageSize.toString());
    }, [pageSettings.pageSize]);
    const [isOpen, setIsOpen] = useState(false);

    function handleDecreasePageSize() {
        if (pageSettings.pageSize >= 10) {
            setPageSettings({ ...pageSettings, pageSize: pageSettings.pageSize - 5 });
        }
        if (pageSettings.pageSize - 5 < 5) {
            setPageSettings({ ...pageSettings, pageSize: 5 });
        }
    }
    function handleIncreasePageSize() {
        if (pageSettings.pageSize <= 95) {
            setPageSettings({ ...pageSettings, pageSize: pageSettings.pageSize + 5 });
        }
        if (pageSettings.pageSize + 5 > 100) {
            setPageSettings({ ...pageSettings, pageSize: 100 });
        }
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPageSize(e.target.value);
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
            setPageSettings({ ...pageSettings, pageSize: numVal });
        }
        setLocalPageSize(numVal.toString());
    };

    return (
        <aside
            className={`
                flex flex-col items-center h-[90%] mt-8 ml-4 overflow-hidden
                transition-all duration-300 ease-in-out relative
                ${isOpen ? 'w-80 bg-slate-50 border-2 border-slate-200 rounded-2xl' : 'w-20 bg-white'}
            `}
        >
            <div
                className={`
                    absolute top-4 left-0 w-full flex justify-center 
                    transition-opacity duration-200 z-10
                    ${!isOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}
                `}
            >
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-2xl bg-none text-xl cursor-pointer transition hover:-translate-y-0.5"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Открыть настройки"
                >
                    <Menu size={40} className="text-slate-500" />
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
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-xl font-bold ml-1">
                            <Settings size={25} />
                            <span>Настройки</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            data-tooltip-id="global-tooltip"
                            data-tooltip-content="Закрыть настройки"
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-xl transition-colors cursor-pointer"
                        >
                            <X size={25} />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 gap-1.5 mb-8">
                        <span className="text-sm font-medium text-slate-500">1. Режим таблицы</span>
                        <div className="pl-3 flex items-center justify-between transition">
                            <span className="text-base font-medium text-slate-700">
                                Native Table
                            </span>
                            <Switcher
                                enabled={settings.tanstackTable}
                                onChange={() => {
                                    setSettings({
                                        ...settings,
                                        tanstackTable: !settings.tanstackTable,
                                    });
                                }}
                            />
                            <span className="text-base font-medium text-slate-700">
                                TanStack Table
                            </span>
                        </div>

                        <span className="text-sm font-medium text-slate-500 mt-8">
                            2. Режим просмотра
                        </span>
                        <div className="flex items-center justify-between pl-3">
                            <span className="text-base font-medium text-slate-700">Пагинация</span>
                            <Switcher
                                enabled={settings.dynamicMode}
                                onChange={() => {
                                    const isDynamicMode = !settings.dynamicMode;
                                    setSettings({
                                        ...settings,
                                        dynamicMode: isDynamicMode,
                                        tanstackVirtual: isDynamicMode
                                            ? settings.tanstackVirtual
                                            : false,
                                    });
                                }}
                            />
                            <span className="text-base font-medium text-slate-700">
                                Dynamic Mode
                            </span>
                        </div>

                        <div
                            className={`transition ${!settings.dynamicMode ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <span className="text-sm font-medium text-slate-500 mt-0 pl-4">
                                Режим динамической таблицы
                            </span>
                            <div className="flex items-center justify-between transition pl-8">
                                <span className="text-base font-medium text-slate-700">Native</span>
                                <Switcher
                                    enabled={settings.tanstackVirtual}
                                    onChange={() =>
                                        setSettings({
                                            ...settings,
                                            tanstackVirtual: !settings.tanstackVirtual,
                                        })
                                    }
                                />
                                <span className="text-base font-medium text-slate-700">
                                    TanStack Virtual
                                </span>
                            </div>
                        </div>

                        <span className="text-sm font-medium text-slate-500 mt-8">
                            3. Режим подгрузки
                        </span>
                        <div className="flex items-center justify-between pl-3 mb-2">
                            <span className="text-base font-medium text-slate-700">
                                База данных
                            </span>
                            <Switcher
                                enabled={settings.zustand}
                                onChange={() =>
                                    setSettings({
                                        ...settings,
                                        zustand: !settings.zustand,
                                    })
                                }
                            />
                            <span className="text-base font-medium text-slate-700">Zustand</span>
                        </div>
                    </div>

                    {!settings.dynamicMode && (
                        <div
                            className="
                                flex flex-col items-center justify-center 
                                w-full rounded-lg p-3 gap-2 
                                border-2 border-dashed border-slate-300 
                                mt-auto
                            "
                        >
                            <span className="text-sm font-medium text-slate-500">
                                Число записей на странице:
                            </span>

                            <div className="flex items-center justify-center gap-2 bg-none h-1/2 rounded-lg">
                                <button
                                    onClick={handleDecreasePageSize}
                                    disabled={pageSettings.pageSize === 5}
                                    className="flex items-center justify-center text-blue-500 p-1 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Minus className="w-6 h-6" strokeWidth={2.5} />
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
                                    className="flex items-center justify-center text-blue-500 p-1 hover:bg-slate-200 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus className="w-6 h-6" strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
