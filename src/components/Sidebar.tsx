import { Switcher } from './Switcher';

export function Sidebar({
    settings,
    onSettingsChange,
    page,
    onPageChange,
    pageSize,
    onPageSizeChange,
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
    page: number;
    onPageChange: (newPage: number) => void;
    pageSize: number;
    onPageSizeChange: (newPageSize: number) => void;
}) {
    function handlePrevPage() {
        if (page > 1) {
            onPageChange(page - 1);
        }
    }
    function handleNextPage() {
        onPageChange(page + 1);
    }

    function handleDecreasePageSize() {
        if (pageSize >= 20) {
            onPageSizeChange(pageSize - 10);
        }
    }
    function handleIncreasePageSize() {
        if (pageSize < 80) {
            onPageSizeChange(pageSize + 10);
        }
    }
    // function handleTanstacktable() {
    //     onSettingsChange({
    //         ...settings,
    //         tanstackTable: !settings.tanstackTable,
    //     });
    //     console.log('settings изменились: ', settings);
    // }

    return (
        <aside className="flex flex-col w-64 bg-slate-50 border-r-3 border-slate-200 p-5 h-full overflow-y-auto">
            <div className="flex items-center gap-2 text-slate-500 mb-4 text-md font-bold">
                <span>⚙️</span>
                Settings
            </div>

            <div className="flex flex-col flex-1 gap-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">TanStack Table</span>
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

            <div className="flex flex-col items-center h-40 rounded-lg p-2">
                <span className="text-slate-700 text-sm font-medium">
                    Число записей на странице:
                </span>

                <div className="flex items-center justify-center gap-2 bg-none h-1/2 w-full rounded-lg">
                    <button
                        onClick={handleDecreasePageSize}
                        disabled={pageSize === 10}
                        className="text-blue-500 text-4xl pb-2 pr-1 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        –
                    </button>
                    <span className="text-slate-700 text-lg">{pageSize}</span>
                    <button
                        onClick={handleIncreasePageSize}
                        disabled={pageSize === 80}
                        className="text-blue-500 text-4xl pb-2 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>
                <span className="text-slate-700 text-sm font-medium mt-3">Номер страницы:</span>
                <div className="flex items-center justify-center gap-3 bg-none h-1/2 w-full rounded-lg">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="flex items-center justify-center text-slate-700 text-3xl bg-blue-400 w-12 h-7 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed pb-1"
                    >
                        {'<'}
                    </button>
                    <input
                        type="number"
                        min={1}
                        value={page}
                        onChange={(e) => {
                            let val = parseInt(e.target.value, 10);

                            if (isNaN(val)) {
                                return;
                            }
                            if (val < 1) val = 1;
                            onPageChange(val);
                        }}
                        className="w-14 h-7 text-center text-slate-700 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 no-spinner"
                    />
                    <button
                        onClick={handleNextPage}
                        className="flex items-center justify-center text-slate-700 text-3xl bg-blue-400 w-12 h-7 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed pb-1 no-spinner"
                    >
                        {'>'}
                    </button>
                </div>
            </div>
        </aside>
    );
}
