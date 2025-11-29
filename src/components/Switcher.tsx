export function Switcher({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <div
            onClick={onChange}
            className={`
        w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
        ${enabled ? 'bg-green-500' : 'bg-slate-300'}
      `}
        >
            <div
                className={`
          bg-white w-3.5 h-3.5 rounded-full transform duration-300 ease-in-out
          ${enabled ? 'translate-x-full' : 'translate-x-0'}
        `}
            />
        </div>
    );
}
