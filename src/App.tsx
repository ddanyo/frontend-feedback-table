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
                <main className="flex flex-col flex-1 bg-white px-6 py-4">
                    <Table
                        searchTerm={debounceSearch}
                        settings={settings}
                        pageSettings={pageSettings}
                        onPageSettingsChange={setPageSettings}
                    />
                    {!settings.dynamicMode ? (
                        <div className="flex flex-col justify-center items-center h-8 rounded-lg p-1 gap-1 mt-2">
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
