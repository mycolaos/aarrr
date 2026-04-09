import type { FunnelSection } from './Types';

export const getColorsForStage = (stage: FunnelSection) => {
  switch (stage) {
    case 'Acquisition':
      return { bg: 'bg-blue-50/30', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-500', icon: 'text-blue-500', iconBg: 'bg-blue-100', hover: 'hover:bg-blue-50/80' };
    case 'Activation':
      return { bg: 'bg-green-50/30', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-500', icon: 'text-green-500', iconBg: 'bg-green-100', hover: 'hover:bg-green-50/80' };
    case 'Retention':
      return { bg: 'bg-purple-50/30', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-500', icon: 'text-purple-500', iconBg: 'bg-purple-100', hover: 'hover:bg-purple-50/80' };
    case 'Revenue':
      return { bg: 'bg-orange-50/30', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-500', icon: 'text-orange-500', iconBg: 'bg-orange-100', hover: 'hover:bg-orange-50/80' };
    case 'Referral':
      return { bg: 'bg-fuchsia-50/30', border: 'border-fuchsia-200', text: 'text-fuchsia-600', badge: 'bg-fuchsia-500', icon: 'text-fuchsia-500', iconBg: 'bg-fuchsia-100', hover: 'hover:bg-fuchsia-50/80' };
  }
};
