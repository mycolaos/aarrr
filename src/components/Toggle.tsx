export const Toggle = ({ label, impact, active, onClick }: { label: string, impact: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 rounded border text-sm transition-colors ${active
      ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
  >
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <span className={active ? 'text-blue-600' : 'text-gray-400'}>{impact}</span>
    </div>
  </button>
);