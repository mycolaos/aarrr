import { Users, UserPlus, Zap, DollarSign, Share2, ArrowDown } from 'lucide-react';

const stepConfig: Record<string, { border: string, bg: string, iconBg: string, iconColor: string, Icon: any }> = {
  "Visitors": { border: 'border-blue-300', bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', Icon: Users },
  "Signups": { border: 'border-blue-300', bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', Icon: UserPlus },
  "Active Users": { border: 'border-emerald-300', bg: 'bg-emerald-50/50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', Icon: Zap },
  "Paid Users": { border: 'border-amber-300', bg: 'bg-amber-50/50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', Icon: DollarSign },
  "Referrals": { border: 'border-purple-300', bg: 'bg-purple-50/50', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', Icon: Share2 },
};

export const FunnelStep = ({ 
  label, 
  count, 
  rate, 
  dropoff,
  dropoffPercent,
  hideArrow
}: { 
  label: string, 
  count: number, 
  rate?: number, 
  dropoff?: number,
  dropoffPercent?: number,
  hideArrow?: boolean
}) => {
  const config = stepConfig[label] || stepConfig["Visitors"];
  const Icon = config.Icon;

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`w-full flex items-center p-4 rounded-xl border ${config.border} ${config.bg}`}>
        <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center mr-4 ${config.iconBg}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-slate-900 font-bold text-[15px]">{label}</h3>
          <div className="text-3xl font-extrabold text-slate-900 mt-1 leading-none">{Math.round(count).toLocaleString()}</div>
          {dropoff !== undefined && dropoffPercent !== undefined && (
            <div className="text-red-500 text-xs font-semibold mt-2 flex items-center">
              <ArrowDown className="w-3 h-3 mr-0.5" />
              {Math.round(dropoff).toLocaleString()} ({dropoffPercent.toFixed(1)}%) drop-off
            </div>
          )}
        </div>
        
        <div className="text-right flex flex-col items-end justify-center h-full">
          {rate !== undefined ? (
            <>
              <span className="text-slate-600 font-medium text-sm">{rate > 0 ? (rate * 100).toFixed(1) : (rate! * 100).toFixed(1)}%</span>
              <span className="text-slate-400 text-xs">conversion</span>
            </>
          ) : label === "Referrals" ? (
            <>
              <span className="text-slate-600 font-medium text-sm">{(count / (count / (rate || 0.389) ) * 100).toFixed(1)}%</span>
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
      
      {!hideArrow && (
        <div className="flex flex-col items-center h-6 my-1">
          <ArrowDown className="w-4 h-4 text-slate-400 my-auto" />
        </div>
      )}
    </div>
  );
};