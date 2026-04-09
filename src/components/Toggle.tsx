import { Info } from 'lucide-react';

export const Toggle = ({ label, impact, active, onClick, colorClass = "bg-blue-600", disabled = false, tooltip }: { label: string, impact: string, active: boolean, onClick: () => void, colorClass?: string, disabled?: boolean, tooltip?: string }) => (
  <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
    <div className="w-full grid grid-cols-2 gap-2">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {tooltip && (
          <div className="group relative ml-1.5 flex items-center">
            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 w-48 p-2 bg-slate-800 text-xs text-white rounded shadow-lg invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity z-10 text-center pointer-events-none">
              {tooltip}
              <div className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-800" />
            </div>
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-emerald-600 text-right pr-3 flex items-center justify-end">{impact}</span>
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