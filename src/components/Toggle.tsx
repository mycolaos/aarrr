export const Toggle = ({ label, impact, active, onClick, colorClass = "bg-blue-600" }: { label: string, impact: string, active: boolean, onClick: () => void, colorClass?: string }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <span className="text-xs font-medium text-emerald-600">{impact}</span>
    </div>
    <button
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
        active ? colorClass : 'bg-slate-200'
      }`}
      role="switch"
      aria-checked={active}
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