// import { Search } from './Search';
import { useState } from 'react';

export function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white sticky top-0 z-20">
            <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    M
                </div>
                <span>Monitoring</span>
            </div>
            <div className="relative w-96">
                <input
                    type="text"
                    placeholder="Search..."
                    className="block w-full pl-4 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </header>
    );
}
