import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Table } from './components/Table';
import { useDebounce } from './hooks/useDebounce';

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
        <div className="h-screen w-full bg-white flex flex-col">
            <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden pb-6">
                <Sidebar
                    settings={settings}
                    onSettingsChange={setSettings}
                    pageSettings={pageSettings}
                    onPageSettingsChange={setPageSettings}
                />
                <main className="flex flex-col items-center flex-1 px-6 pt-8">
                    <div className="flex flex-col items-center h-full w-[80%] overflow-hidden">
                        <Table
                            searchTerm={debounceSearch}
                            settings={settings}
                            pageSettings={pageSettings}
                            onPageSettingsChange={setPageSettings}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
