import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Table } from './components/Table';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
            <Header />

            <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
                <Sidebar />

                <main className="flex-1 overflow-y-auto bg-white p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Отзывы</h1>
                    </div>
                    <Table />
                </main>
            </div>
        </div>
    );
}

export default App;
