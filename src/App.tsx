import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Table } from './components/Table';
import { useDynamicFavicon } from './hooks/useDynamicFavicon';

function App() {
    console.log('App');
    useDynamicFavicon('/icons/favicon-active.ico', '/icons/favicon-inactive.ico');
    return (
        <>
            <Tooltip id="global-tooltip" />
            <div className="h-screen w-full bg-white flex flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden pb-6">
                    <Sidebar />
                    <main className="flex flex-col flex-1 items-center px-6 pt-8">
                        <div className="flex flex-col items-center h-full w-[80%] overflow-hidden">
                            <Table />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

export default App;
