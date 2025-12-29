import { Search, CaseSensitive, WholeWord } from 'lucide-react';
import { useState } from 'react';
import useAppStore from '../store/useZustandStore';
import { useStore } from '../store/useStore';
import { useDebounce } from '../hooks/useDebounce';

export function Header() {
    console.log('Header');

    const { get: getSettings } = useStore.Settings();
    const {
        get: getSearchSettings,
        set: setSearchSettings,
        update: updateSearchSettings,
    } = useStore.SearchSettings();

    const [localSearchterm, setLocalSearchterm] = useState(getSearchSettings().searchTerm);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchterm(e.target.value);
    };

    useDebounce(() => {
        console.log('Debounce triggered:', localSearchterm);

        const currentSearch = getSearchSettings();

        if (currentSearch.searchTerm !== localSearchterm) {
            setSearchSettings({
                ...currentSearch,
                searchTerm: localSearchterm,
            });
        }

        if (getSettings().zustand) {
            useAppStore
                .getState()
                .searchLocal(
                    localSearchterm,
                    getSearchSettings().caseSensitive,
                    getSearchSettings().wholeWord
                );
        }
    }, 300);

    function handleSensitiveChange() {
        updateSearchSettings((prev) => {
            const newVal = !prev.caseSensitive;

            if (getSettings().zustand) {
                useAppStore.getState().searchLocal(localSearchterm, newVal, prev.wholeWord);
            }
            return { ...prev, caseSensitive: newVal };
        });
    }

    function handleWholewordChange() {
        updateSearchSettings((prev) => {
            const newVal = !prev.wholeWord;
            if (getSettings().zustand) {
                useAppStore.getState().searchLocal(localSearchterm, prev.caseSensitive, newVal);
            }
            return { ...prev, wholeWord: newVal };
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
                        value={localSearchterm}
                        onChange={handleSearchChange}
                    />

                    <div className="flex items-center pr-2 gap-1">
                        <button
                            className={`p-1 hover:bg-slate-200 rounded text-blue-500 ${getSearchSettings().caseSensitive ? 'border-blue-400 border-2' : 'border-2 border-slate-100'}`}
                            data-tooltip-id="global-tooltip"
                            data-tooltip-content="Поиск с учетом регистра"
                            onClick={handleSensitiveChange}
                        >
                            <CaseSensitive size={20} />
                        </button>
                        <button
                            className={`p-1 hover:bg-slate-200 rounded text-blue-500 ${getSearchSettings().wholeWord ? 'border-blue-400 border-2' : 'border-2 border-slate-100'}`}
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
