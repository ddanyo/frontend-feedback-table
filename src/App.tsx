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
    });

    return (
        <div className="h-screen w-full bg-slate-200 flex flex-col overflow-hidden">
            <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar settings={settings} onSettingsChange={setSettings} />
                <main className="flex flex-col flex-1 bg-white p-8 overflow-hidden">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6 shrink-0">Отзывы</h1>
                    <Table searchTerm={debounceSearch} />
                </main>
            </div>
        </div>
    );
}

export default App;
