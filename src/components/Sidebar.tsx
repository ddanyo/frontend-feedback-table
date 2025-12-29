import { useEffect, useMemo, useState } from 'react';
import { Switcher } from './Switcher';
import { Settings, X, Menu, Plus, Minus, RefreshCw } from 'lucide-react';
import useZustandStore from '../store/useZustandStore';
import { useStore } from '../store/useStore';

export function Sidebar() {
    console.log('Sidebar');

    const {
        get: getPageSettings,
        set: setPageSettings,
        update: updatePageSettings,
    } = useStore.PageSettings();
    const { get: getSettings, set: setSettings, update: updateSettings } = useStore.Settings();

    const pageSize = useMemo(() => getPageSettings().pageSize, [getPageSettings]);
    const [localPageSize, setLocalPageSize] = useState<string>(pageSize.toString());

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (isRefreshing || !getSettings().zustand) return;

        setIsRefreshing(true);

        useZustandStore.getState().loadAll();

        setTimeout(() => {
            setIsRefreshing(false);
        }, 2000);
    };

    useEffect(() => {
        setLocalPageSize(pageSize.toString());
    }, [pageSize]);
    const [isOpen, setIsOpen] = useState(false);

    function handleDecreasePageSize() {
        const current = getPageSettings();
        if (current.pageSize >= 10) {
            updatePageSettings((prev) => ({
                ...prev,
                pageSize: prev.pageSize - 5,
            }));
        }
        if (current.pageSize - 5 < 5) {
            setPageSettings({ ...current, pageSize: 5 });
        }
    }
    function handleIncreasePageSize() {
        const current = getPageSettings();
        if (current.pageSize <= 95) {
            updatePageSettings((prev) => ({
                ...current,
                pageSize: prev.pageSize + 5,
            }));
        }
        if (current.pageSize + 5 > 100) {
            setPageSettings({ ...current, pageSize: 100 });
        }
    }

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPageSize(e.target.value);
    };

    const handlePageSizeBlur = () => {
        const current = getPageSettings();
        let numVal = parseInt(localPageSize, 10);
        if (isNaN(numVal) || numVal < 5) {
            setLocalPageSize(current.pageSize.toString());
            return;
        }
        if (numVal > 100) {
            numVal = 100;
        }
        if (numVal !== current.pageSize) {
            setPageSettings({ ...current, pageSize: numVal });
        }
        setLocalPageSize(numVal.toString());
    };

    return (
        <aside
            className={`
                flex flex-col items-center h-[90%] mt-8 ml-4 overflow-hidden
                transition-all duration-500 ease-in-out relative
                ${isOpen ? 'w-90 bg-slate-50 border-2 border-slate-200 rounded-2xl' : 'w-20 bg-white'}
            `}
        >
            <div
                className={`
                    absolute top-4 left-0 w-full flex justify-center 
                    transition-opacity duration-400 z-10
                    ${!isOpen ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}
                `}
            >
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-2xl bg-none text-xl cursor-pointer transition hover:-translate-y-0.5"
                    data-tooltip-id="global-tooltip"
                    data-tooltip-content="Открыть настройки"
                    data-tooltip-hidden={isOpen}
                >
                    <Menu size={40} className="text-slate-500" />
                </button>
            </div>

            <div
                className={`
                    flex flex-col h-full w-full min-w-[350px] transition-opacity duration-400 overflow-y-auto overflow-x-hidden
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
                            data-tooltip-hidden={!isOpen}
                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-xl transition-colors cursor-pointer"
                        >
                            <X size={25} />
                        </button>
                    </div>

                    <div className="flex flex-col flex-1 gap-1.5 mb-8">
                        <span className="text-sm font-medium text-slate-500">1. Режим таблицы</span>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                            <span className="text-base font-medium text-slate-700 justify-self-end">
                                Native Table
                            </span>
                            <Switcher
                                enabled={getSettings().tanstackTable}
                                onChange={() => {
                                    updateSettings((prev) => ({
                                        ...prev,
                                        tanstackTable: !prev.tanstackTable,
                                    }));
                                }}
                            />
                            <span className="text-base font-medium text-slate-700 justify-self-start">
                                TanStack Table
                            </span>
                        </div>

                        <span className="text-sm font-medium text-slate-500 mt-8">
                            2. Режим просмотра
                        </span>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                            <span className="text-base font-medium text-slate-700 justify-self-end">
                                Пагинация
                            </span>
                            <Switcher
                                enabled={getSettings().dynamicMode}
                                onChange={() => {
                                    const current = getSettings();
                                    const isDynamicMode = !current.dynamicMode;
                                    setSettings({
                                        ...current,
                                        dynamicMode: isDynamicMode,
                                        tanstackVirtual: isDynamicMode
                                            ? current.tanstackVirtual
                                            : false,
                                    });
                                }}
                            />
                            <span className="text-base font-medium text-slate-700 justify-self-start">
                                Dynamic Mode
                            </span>
                        </div>

                        <div
                            className={`transition ${!getSettings().dynamicMode ? 'opacity-40 pointer-events-none' : ''}`}
                        >
                            <span className="text-sm font-medium text-slate-500 mt-0 pl-4">
                                Режим динамической таблицы
                            </span>
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5">
                                <span className="text-base font-medium text-slate-700 justify-self-end">
                                    Native
                                </span>
                                <Switcher
                                    enabled={getSettings().tanstackVirtual}
                                    onChange={() =>
                                        updateSettings((prev) => ({
                                            ...prev,
                                            tanstackVirtual: !prev.tanstackVirtual,
                                        }))
                                    }
                                />
                                <span className="text-base font-medium text-slate-700 justify-self-start">
                                    TanStack Virtual
                                </span>
                            </div>
                        </div>

                        <span className="text-sm font-medium text-slate-500 mt-8">
                            3. Режим подгрузки
                        </span>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 mb-2">
                            <span className="text-base font-medium text-slate-700 justify-self-end">
                                База данных
                            </span>

                            <Switcher
                                enabled={getSettings().zustand}
                                onChange={() =>
                                    updateSettings((prev) => ({
                                        ...prev,
                                        zustand: !prev.zustand,
                                    }))
                                }
                            />

                            <div className="flex items-center gap-4 justify-self-start">
                                <span className="text-base font-medium text-slate-700">
                                    Zustand
                                </span>

                                <button
                                    onClick={handleRefresh}
                                    disabled={!getSettings().zustand || isRefreshing}
                                    className={`
                p-1.5 rounded-lg transition-all flex items-center justify-center
                ${
                    !getSettings().zustand
                        ? 'text-slate-300 cursor-not-allowed bg-transparent'
                        : isRefreshing
                          ? 'text-blue-400 cursor-wait'
                          : 'text-blue-600 hover:bg-blue-100 cursor-pointer active:scale-95'
                }
            `}
                                    data-tooltip-id="global-tooltip"
                                    data-tooltip-content="Обновить данные"
                                    data-tooltip-hidden={!getSettings().zustand || isRefreshing}
                                >
                                    <RefreshCw
                                        size={18}
                                        className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!getSettings().dynamicMode && (
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
                                    disabled={getPageSettings().pageSize === 5}
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
                                    disabled={getPageSettings().pageSize === 100}
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
