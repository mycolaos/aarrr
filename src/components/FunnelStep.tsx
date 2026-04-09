import { Users, UserPlus, Zap, DollarSign, Share2, ArrowDown } from 'lucide-react';
import { getColorsForStage } from '../colors';

const stepIcons: Record<string, any> = {
  "Visitors": Users,
  "Signups": UserPlus,
  "Active Users": Zap,
  "Paid Users": DollarSign,
  "Referrals": Share2,
};

export const FunnelStep = ({
  label,
  count,
  rate,
  dropoff,
  dropoffPercent,
  showTopArrow,
  plusvalence
}: {
  label: string,
  count: number,
  rate?: number,
  dropoff?: number,
  dropoffPercent?: number,
  showTopArrow?: boolean,
  plusvalence?: number
}) => {
  const colors = getColorsForStage(label);
  const Icon = stepIcons[label] || Users;
  const showDropOff = dropoff !== undefined && dropoffPercent !== undefined;

  return (
    <div className="flex flex-col items-center w-full">
      {showDropOff && (
        <div className="text-red-500 text-xs font-semibold my-2 flex items-center">
          <ArrowDown className="w-3 h-3 mr-0.5" />
          {Math.round(dropoff).toLocaleString()} ({dropoffPercent.toFixed(1)}%) drop-off
        </div>
      )}
      {!showDropOff && showTopArrow && (
        <div className="flex flex-col items-center h-6 my-1">
          <ArrowDown className="w-4 h-4 text-slate-400 my-auto" />
        </div>
      )}
      <div className={`w-full flex items-center p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
        <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center mr-4 ${colors.iconBg}`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-slate-900 font-bold text-[15px]">{label}</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <div className="text-3xl font-extrabold text-slate-900 leading-none">{Math.round(count).toLocaleString()}</div>
            {plusvalence !== undefined && plusvalence > 0 && (
              <div className="text-[11px] font-bold text-blue-600 bg-blue-50/80 border border-blue-100 px-1.5 py-0.5 rounded-full shadow-sm flex items-center">
                +{Math.round(plusvalence).toLocaleString()} from referrals
              </div>
            )}
          </div>
        </div>

        <div className="text-right flex flex-col items-end justify-center h-full">
          {rate !== undefined ? (
            <>
              <span className="text-slate-600 font-medium text-sm">{rate > 0 ? (rate * 100).toFixed(1) : (rate! * 100).toFixed(1)}%</span>
              <span className="text-slate-400 text-xs">conversion</span>
            </>
          ) : label === "Referrals" ? (
            <>
              <span className="text-slate-600 font-medium text-sm">{(count / (count / (rate || 0.389)) * 100).toFixed(1)}%</span>
              <span className="text-slate-400 text-xs">of paid</span>
            </>
          ) : (
            <>
              <span className="text-slate-800 font-bold">—</span>
              <span className="text-slate-400 text-xs">baseline</span>
            </>
          )}
        </div>
      </div>


    </div>
  );
};
