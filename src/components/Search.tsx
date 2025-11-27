import { useState } from 'react';

export function Search() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="relative w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 select-none">
                🔍
            </span>
            <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}
