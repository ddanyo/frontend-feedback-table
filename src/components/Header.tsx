export function Header({
    searchTerm,
    onSearchTermChange,
}: {
    searchTerm: string;
    onSearchTermChange: (newTerm: string) => void;
}) {
    return (
        <header className="h-18 border-b-3 border-slate-200 flex items-center justify-between px-6 bg-white">
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
                    className="block text-slate-800 w-full pl-4 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                />
            </div>
        </header>
    );
}
