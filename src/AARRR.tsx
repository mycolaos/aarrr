import { Card, FunnelStep, Toggle } from './components';
import { useMemo, useState } from 'react';

export type AppState = {
  acquisition: string;
  activation: { cta: boolean; friction: boolean };
  retention: { onboarding: boolean; email: boolean };
  revenue: { trial: boolean; pricing: boolean };
  referral: { incentive: boolean; share: boolean };
};

const baseVisitors = 1000;

export function applyModifiers(state: AppState) {
  const visitors = state.acquisition === 'Ads' ? 2000 : state.acquisition === 'Hacker News' ? 1500 : baseVisitors;

  let activationRate = 0.20;
  if (state.activation.cta) activationRate += 0.05;
  if (state.activation.friction) activationRate += 0.10;

  let retentionRate = 0.40;
  if (state.retention.onboarding) retentionRate += 0.15;
  if (state.retention.email) retentionRate += 0.10;

  let revenueRate = 0.20;
  if (state.revenue.trial) revenueRate += 0.10;
  if (state.revenue.pricing) revenueRate += 0.05;

  let referralRate = 0.50;
  if (state.referral.incentive) referralRate += 0.30;
  if (state.referral.share) referralRate += 0.20;

  return { visitors, activationRate, retentionRate, revenueRate, referralRate };
}

export function computeFunnel(rates: ReturnType<typeof applyModifiers>) {
  const signups = rates.visitors * rates.activationRate;
  const active = signups * rates.retentionRate;
  const paid = active * rates.revenueRate;
  const referrals = paid * rates.referralRate;
  return { visitors: rates.visitors, signups, active, paid, referrals };
}

export function getImpact(state: AppState) {
  const currentRates = applyModifiers(state);
  const currentFunnel = computeFunnel(currentRates);

  const baseAcquisitionRates = applyModifiers({ ...state, acquisition: 'X post' });
  const baseActivationRates = applyModifiers({ ...state, activation: { cta: false, friction: false } });
  const baseRetentionRates = applyModifiers({ ...state, retention: { onboarding: false, email: false } });
  const baseRevenueRates = applyModifiers({ ...state, revenue: { trial: false, pricing: false } });
  const baseReferralRates = applyModifiers({ ...state, referral: { incentive: false, share: false } });

  const deltas = {
    Acquisition: Math.round(currentFunnel.paid - computeFunnel(baseAcquisitionRates).paid),
    Activation: Math.round(currentFunnel.paid - computeFunnel(baseActivationRates).paid),
    Retention: Math.round(currentFunnel.paid - computeFunnel(baseRetentionRates).paid),
    Revenue: Math.round(currentFunnel.paid - computeFunnel(baseRevenueRates).paid),
    Referral: Math.round(currentFunnel.referrals - computeFunnel(baseReferralRates).referrals)
  };

  const topInsight = Object.entries(deltas).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0]);

  return { deltas, topInsight };
}

export default function GrowthFunnelSimulator() {
  // States
  const [acquisition, setAcquisition] = useState('X post');
  const [activation, setActivation] = useState({ cta: false, friction: false });
  const [retention, setRetention] = useState({ onboarding: false, email: false });
  const [revenue, setRevenue] = useState({ trial: false, pricing: false });
  const [referral, setReferral] = useState({ incentive: false, share: false });

  // Calculations
  const metrics = useMemo(() => {
    const state = { acquisition, activation, retention, revenue, referral };
    const rates = applyModifiers(state);
    const funnel = computeFunnel(rates);
    const { deltas, topInsight } = getImpact(state);

    return { ...rates, ...funnel, deltas, topInsight };
  }, [acquisition, activation, retention, revenue, referral]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* 1. Header */}
      <header className="h-[120px] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-slate-900">Growth Funnel Simulator</h1>
        <p className="text-slate-500 mt-2">See how changes impact user conversion</p>
      </header>

      <main className="max-w-[1440px] mx-auto px-[80px] grid grid-cols-12 gap-[24px]">

        {/* 2. Funnel Visualization */}
        <section className="col-span-12 mb-8 flex justify-center">
          <div className="bg-slate-50 p-6 rounded-xl flex flex-col items-center w-full max-w-2xl">
            <FunnelStep
              label="Visitors"
              count={metrics.visitors}
              dropoff={metrics.visitors - metrics.signups}
            />
            <FunnelStep
              label="Signups"
              count={metrics.signups}
              rate={metrics.activationRate}
              baseRate={0.20}
              dropoff={metrics.signups - metrics.active}
            />
            <FunnelStep
              label="Active Users"
              count={metrics.active}
              rate={metrics.retentionRate}
              baseRate={0.40}
              dropoff={metrics.active - metrics.paid}
            />
            <FunnelStep
              label="Paid Customers"
              count={metrics.paid}
              rate={metrics.revenueRate}
              baseRate={0.20}
            />
            <div className="my-2 text-blue-400 text-sm font-bold">↺ Generates</div>
            <FunnelStep
              label="Referrals"
              count={metrics.referrals}
            />
          </div>
        </section>

        {/* Bottom Split: Controls & Insights */}
        <div className="col-span-12 grid grid-cols-12 gap-[24px]">

          {/* 3. Controls (Left Side) */}
          <section className="col-span-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Conversion Levers</h2>

            <Card>
              <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase">Acquisition</h3>
              <select
                className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                value={acquisition}
                onChange={(e) => setAcquisition(e.target.value)}
              >
                <option value="X post">X post (1,000 traffic)</option>
                <option value="Hacker News">Hacker News (1,500 traffic)</option>
                <option value="Ads">Ads (2,000 traffic)</option>
              </select>
            </Card>

            <Card className="space-y-2">
              <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase">Activation</h3>
              <Toggle label="Improve CTA" impact="+5%" active={activation.cta} onClick={() => setActivation(prev => ({ ...prev, cta: !prev.cta }))} />
              <Toggle label="Reduce friction" impact="+10%" active={activation.friction} onClick={() => setActivation(prev => ({ ...prev, friction: !prev.friction }))} />
            </Card>

            <Card className="space-y-2">
              <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase">Retention</h3>
              <Toggle label="Better onboarding" impact="+15%" active={retention.onboarding} onClick={() => setRetention(prev => ({ ...prev, onboarding: !prev.onboarding }))} />
              <Toggle label="Email reminder" impact="+10%" active={retention.email} onClick={() => setRetention(prev => ({ ...prev, email: !prev.email }))} />
            </Card>

            <Card className="space-y-2">
              <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase">Revenue</h3>
              <Toggle label="Free trial" impact="+10%" active={revenue.trial} onClick={() => setRevenue(prev => ({ ...prev, trial: !prev.trial }))} />
              <Toggle label="Better pricing" impact="+5%" active={revenue.pricing} onClick={() => setRevenue(prev => ({ ...prev, pricing: !prev.pricing }))} />
            </Card>

            <Card className="space-y-2">
              <h3 className="text-sm font-bold text-slate-500 mb-1 uppercase">Referral</h3>
              <Toggle label="Invite incentive" impact="+0.3x" active={referral.incentive} onClick={() => setReferral(prev => ({ ...prev, incentive: !prev.incentive }))} />
              <Toggle label="Share button" impact="+0.2x" active={referral.share} onClick={() => setReferral(prev => ({ ...prev, share: !prev.share }))} />
            </Card>
          </section>

          {/* 4. Insights (Right Side) */}
          <section className="col-span-6">
            <div className="sticky top-6 space-y-6">
              <Card className="bg-blue-600 border-none text-white p-8">
                <h2 className="text-blue-100 text-sm font-bold uppercase tracking-wide mb-2">Most Critical Impact</h2>
                <div className="text-4xl font-bold">
                  {metrics.topInsight[0]}: +{metrics.topInsight[1]} <span className="text-2xl font-normal opacity-80">users</span>
                </div>

                <div className="mt-8 pt-6 border-t border-blue-500/50">
                  <h3 className="text-sm font-medium text-blue-100 mb-3">All Metrics vs Baseline</h3>
                  <ul className="space-y-2">
                    {Object.entries(metrics.deltas)
                      .filter(([_, val]) => val > 0)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, val]) => (
                        <li key={key} className="flex justify-between text-sm">
                          <span>{key}</span>
                          <span className="font-bold">+{val}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </Card>

              {/* 5. Experiments */}
              <Card className="bg-amber-50 border-amber-200">
                <h3 className="font-bold text-amber-800 mb-3">🧪 What I'd test next</h3>
                <ul className="list-disc pl-5 space-y-2 text-amber-700 text-sm">
                  {!activation.friction && <li>Test reducing signup friction</li>}
                  {!retention.onboarding && <li>Improve onboarding experience</li>}
                  {!revenue.trial && <li>Introduce a 14-day free trial</li>}
                  {activation.friction && retention.onboarding && revenue.trial && <li>Baseline optimized. Focus on scaling top-of-funnel acquisition.</li>}
                </ul>
              </Card>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}