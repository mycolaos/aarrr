import type { LucideIcon } from 'lucide-react';

interface ExperimentSuggestionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: 'green' | 'purple' | 'orange' | 'fuchsia';
}

export function ExperimentSuggestion({ icon: Icon, title, description, color }: ExperimentSuggestionProps) {
  const colorClasses = {
    green: {
      border: 'border-green-100',
      bg: 'bg-green-50/30',
      hover: 'hover:bg-green-50/80',
      icon: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    purple: {
      border: 'border-purple-100',
      bg: 'bg-purple-50/30',
      hover: 'hover:bg-purple-50/80',
      icon: 'text-purple-600',
      iconBg: 'bg-purple-100',
    },
    orange: {
      border: 'border-orange-100',
      bg: 'bg-orange-50/30',
      hover: 'hover:bg-orange-50/80',
      icon: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    fuchsia: {
      border: 'border-fuchsia-100',
      bg: 'bg-fuchsia-50/30',
      hover: 'hover:bg-fuchsia-50/80',
      icon: 'text-fuchsia-600',
      iconBg: 'bg-fuchsia-100',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`flex items-start p-3 rounded-xl border ${classes.border} ${classes.bg} ${classes.hover} transition-colors duration-200`}>
      <Icon className={`w-8 h-8 ${classes.icon} mt-0.5 shrink-0 ${classes.iconBg} p-2 rounded-full`} />
      <div className="ml-3">
        <h4 className="font-semibold text-sm text-slate-900 mb-0.5">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
