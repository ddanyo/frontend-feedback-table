import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Table } from './components/Table';

function App() {
    return (
        <div className="h-screen w-full bg-slate-200 flex flex-col overflow-hidden">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex flex-col flex-1 bg-white p-8 overflow-hidden">
                    <h1 className="text-3xl font-bold text-slate-800 mb-6 shrink-0">Отзывы</h1>
                    <Table />
                </main>
            </div>
        </div>
    );
}

export default App;
