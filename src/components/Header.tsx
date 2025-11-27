import { Search } from './Search';

export function Header() {
    return (
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white sticky top-0 z-20">
            <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    M
                </div>
                <span>Monitoring</span>
            </div>
            <Search />
        </header>
    );
}
