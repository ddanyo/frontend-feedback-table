export function Switcher({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <div
            onClick={onChange}
            className={`
        w-10 h-5.5 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300
        ${enabled ? 'bg-green-500' : 'bg-slate-300'}
      `}
        >
            <div
                className={`
          bg-white w-4 h-4 rounded-full transform duration-300 ease-in-out
          ${enabled ? 'translate-x-4' : 'translate-x-0'}
        `}
            />
        </div>
    );
}
