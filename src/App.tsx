import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Table } from './components/Table';
import { useDebounce } from './hooks/useDebounce';
import { PageSwitcher } from './components/PageSwitcher';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const debounceSearch = useDebounce(searchTerm);
    const [settings, setSettings] = useState({
        tanstackTable: false,
        tanstackVirtual: false,
        zustand: false,
        dynamicMode: false,
    });
    const [pageSettings, setPageSettings] = useState({
        page: 1,
        pageSize: 10,
        countPages: 1,
    });

    return (
        <div className="h-screen w-full bg-slate-200 flex flex-col">
            <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    settings={settings}
                    onSettingsChange={setSettings}
                    pageSettings={pageSettings}
                    onPageSettingsChange={setPageSettings}
                />
                <main className="flex flex-col items-center flex-1 bg-white px-6 pt-8 pb-6">
                    <div className="flex flex-col items-center h-full w-3/4 overflow-hidden border border-slate-200 rounded-lg bg-white">
                        <Table
                            searchTerm={debounceSearch}
                            settings={settings}
                            pageSettings={pageSettings}
                            onPageSettingsChange={setPageSettings}
                        />
                    </div>
                    {!settings.dynamicMode ? (
                        <div className="flex flex-col justify-center items-center h-8 rounded-lg pt-2 gap-1 mt-2">
                            <PageSwitcher
                                pageSettings={pageSettings}
                                onPageSettingsChange={setPageSettings}
                            />
                        </div>
                    ) : null}
                </main>
            </div>
        </div>
    );
}

export default App;
