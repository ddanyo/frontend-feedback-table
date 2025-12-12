import { Search, CaseSensitive, WholeWord } from 'lucide-react';
import { useSettings } from '../context/AppContext';

export function Header() {
    const { searchSettings, setSearchSettings, pageSettings, setPageSettings } = useSettings();
    function handleSensitiveChange() {
        setSearchSettings({
            ...searchSettings,
            caseSensitive: !searchSettings.caseSensitive,
        });
    }
    function handleWholewordChange() {
        setSearchSettings({
            ...searchSettings,
            wholeWord: !searchSettings.wholeWord,
        });
    }
    return (
        <header className="h-24 border-b-3 border-slate-200 flex items-center justify-between px-6 bg-white">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-800 via-blue-600 to-blue-400 m-4 pb-1">
                Отзывы
            </h1>
            <div className="w-130 h-12 pr-8 inline-flex items-center gap-2">
                <Search size={40} className="text-slate-500" />
                <div className="flex items-center w-full border border-slate-300 rounded-lg bg-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition overflow-hidden">
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="grow bg-transparent text-slate-800 text-xl px-4 py-2 border-none focus:outline-none focus:ring-0 placeholder:text-slate-400"
                        value={searchSettings.searchTerm}
                        onChange={(e) => {
                            setSearchSettings({
                                ...searchSettings,
                                searchTerm: e.target.value,
                            });
                            setPageSettings({
                                ...pageSettings,
                                page: 1,
                            });
                        }}
                    />

                    <div className="flex items-center pr-2 gap-1">
                        <button
                            className={`p-1 hover:bg-slate-200 rounded text-blue-500 ${searchSettings.caseSensitive ? 'border-blue-400 border-2' : 'border-2 border-slate-100'}`}
                            data-tooltip-id="global-tooltip"
                            data-tooltip-content="Поиск с учетом регистра"
                            onClick={handleSensitiveChange}
                        >
                            <CaseSensitive size={20} />
                        </button>
                        <button
                            className={`p-1 hover:bg-slate-200 rounded text-blue-500 ${searchSettings.wholeWord ? 'border-blue-400 border-2' : 'border-2 border-slate-100'}`}
                            data-tooltip-id="global-tooltip"
                            data-tooltip-content="Поиск слова целиком"
                            onClick={handleWholewordChange}
                        >
                            <WholeWord size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
