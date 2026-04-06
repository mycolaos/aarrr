import { Card, FunnelStep, Toggle } from './components';
import { useMemo, useState } from 'react';

export default function GrowthFunnelSimulator() {
  // Base Metrics
  const baseVisitors = 1000;

  // States
  const [acquisition, setAcquisition] = useState('X post');
  const [activation, setActivation] = useState({ cta: false, friction: false });
  const [retention, setRetention] = useState({ onboarding: false, email: false });
  const [revenue, setRevenue] = useState({ trial: false, pricing: false });
  const [referral, setReferral] = useState({ incentive: false, share: false });

  // Calculations
  const metrics = useMemo(() => {
    // Acquisition (Simulating different traffic volumes based on source)
    const visitors = acquisition === 'Ads' ? 2000 : acquisition === 'Hacker News' ? 1500 : baseVisitors;

    // Activation (Base 20%)
    let activationRate = 0.20;
    if (activation.cta) activationRate += 0.05;
    if (activation.friction) activationRate += 0.10;
    const signups = visitors * activationRate;

    // Retention (Base 40%)
    let retentionRate = 0.40;
    if (retention.onboarding) retentionRate += 0.15;
    if (retention.email) retentionRate += 0.10;
    const active = signups * retentionRate;

    // Revenue (Base 20%)
    let revenueRate = 0.20;
    if (revenue.trial) revenueRate += 0.10;
    if (revenue.pricing) revenueRate += 0.05;
    const paid = active * revenueRate;

    // Referral (Base 0.5 per paid user to get 8 from 16)
    let referralRate = 0.50;
    if (referral.incentive) referralRate += 0.30;
    if (referral.share) referralRate += 0.20;
    const referrals = paid * referralRate;

    // Deltas (compared to base state of 1000 visitors)
    const baseSignups = 200;
    const baseActive = 80;
    const basePaid = 16;
    const baseReferrals = 8;

    const deltas = {
      Acquisition: visitors - baseVisitors,
      Activation: Math.round(signups - baseSignups),
      Retention: Math.round(active - baseActive),
      Revenue: Math.round(paid - basePaid),
      Referral: Math.round(referrals - baseReferrals)
    };

    // Find biggest impact
    const topInsight = Object.entries(deltas).reduce((a, b) => a[1] > b[1] ? a : b);

    return { visitors, signups, active, paid, referrals, activationRate, retentionRate, revenueRate, deltas, topInsight };
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