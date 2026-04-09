export type Channel = 'x' | 'hn' | 'referral' | 'ads';

export type FunnelSection = 'Acquisition' | 'Activation' | 'Retention' | 'Revenue' | 'Referral';

export type AppState = {
  acquisition: { channel: Channel };
  activation: { cta: boolean; friction: boolean };
  retention: { onboarding: boolean; email: boolean };
  revenue: { trial: boolean; pricing: boolean };
  referral: { incentive: boolean; share: boolean; factorReferrals: boolean };
};
