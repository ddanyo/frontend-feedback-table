export function Header({
    searchTerm,
    onSearchTermChange,
}: {
    searchTerm: string;
    onSearchTermChange: (newTerm: string) => void;
}) {
    return (
        <header className="h-22 border-b-3 border-slate-200 flex items-center justify-between px-6 bg-white">
            <h1 className="text-4xl font-bold text-slate-800 m-4">Отзывы</h1>
            <div className="w-100 pr-8">
                <input
                    type="text"
                    placeholder="Поиск..."
                    className="block text-slate-800 text-lg h-12 w-full pl-4 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                />
            </div>
        </header>
    );
}
