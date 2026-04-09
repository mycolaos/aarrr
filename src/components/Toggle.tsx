export const Toggle = ({ label, impact, active, onClick, colorClass = "bg-blue-600", disabled = false }: { label: string, impact: string, active: boolean, onClick: () => void, colorClass?: string, disabled?: boolean }) => (
  <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
    <div className="w-full grid grid-cols-2 gap-2">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="text-xs font-medium text-emerald-600 text-right pr-3">{impact}</span>
    </div>
    <button
      onClick={disabled ? undefined : onClick}
      className={`relative inline-flex h-5 w-9 shrink-0 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        active ? colorClass : 'bg-slate-200'
      }`}
      role="switch"
      aria-checked={active}
      disabled={disabled}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          active ? 'translate-x-[8px]' : 'translate-x-[calc(-100%+8px)]'
        }`}
      />
    </button>
  </div>
);