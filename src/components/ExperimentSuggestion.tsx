import type { LucideIcon } from 'lucide-react';
import type { FunnelSection } from '../Types';
import { getColorsForStage } from '../colors';

interface ExperimentSuggestionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  funnelSection: FunnelSection;
}

export function ExperimentSuggestion({ icon: Icon, title, description, funnelSection }: ExperimentSuggestionProps) {
  const colors = getColorsForStage(funnelSection);

  return (
    <div className={`flex items-start p-3 rounded-xl border ${colors.border} ${colors.bg} ${colors.hover} transition-colors duration-200`}>
      <Icon className={`w-8 h-8 ${colors.icon} mt-0.5 shrink-0 ${colors.iconBg} p-2 rounded-full`} />
      <div className="ml-3">
        <h4 className="font-semibold text-sm text-slate-900 mb-0.5">{title}</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
