export const getColorsForStage = (stage: string) => {
  switch (stage) {
    case 'Acquisition':
    case 'Visitors':
      return { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-500', icon: 'text-blue-500', iconBg: 'bg-blue-100' };
    case 'Activation':
    case 'Signups':
      return { bg: 'bg-green-50/50', border: 'border-green-200', text: 'text-green-600', badge: 'bg-green-500', icon: 'text-green-500', iconBg: 'bg-green-100' };
    case 'Retention':
    case 'Active Users':
      return { bg: 'bg-purple-50/50', border: 'border-purple-200', text: 'text-purple-600', badge: 'bg-purple-500', icon: 'text-purple-500', iconBg: 'bg-purple-100' };
    case 'Revenue':
    case 'Paid Users':
      return { bg: 'bg-orange-50/50', border: 'border-orange-200', text: 'text-orange-600', badge: 'bg-orange-500', icon: 'text-orange-500', iconBg: 'bg-orange-100' };
    case 'Referral':
    case 'Referrals':
      return { bg: 'bg-fuchsia-50/50', border: 'border-fuchsia-200', text: 'text-fuchsia-600', badge: 'bg-fuchsia-500', icon: 'text-fuchsia-500', iconBg: 'bg-fuchsia-100' };
    default:
      return { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-600', badge: 'bg-blue-500', icon: 'text-blue-500', iconBg: 'bg-blue-100' };
  }
};
