import { Card, ExperimentSuggestion, FunnelStep, Toggle } from './components';
import { useMemo, useState } from 'react';
import { Megaphone, Zap, RefreshCcw, CircleDollarSign, Users, Lightbulb, Target, Rocket, Mail, TrendingUp } from 'lucide-react';
import { getColorsForStage } from './colors';
import type { AppState, Channel, FunnelSection } from './Types';

const qualityByChannel: Record<Channel, number> = {
  x: 0.5,
  ads: 1,
  hn: 1.5,
  referral: 2,
}

const visitorsByChannel: Record<Channel, number> = {
  x: 1000,
  hn: 1500,
  ads: 3000,
  referral: 0,
}

export const CONTROL_RATES = {
  activation: {
    cta: 0.05,
    friction: 0.10,
  },
  retention: {
    onboarding: 0.15,
    email: 0.10,
  },
  revenue: {
    trial: 0.10,
    pricing: 0.05,
  },
  referral: {
    incentive: 0.50,
    share: 1.20,
  },
};

export function applyModifiers(state: AppState) {
  const channel = state.acquisition.channel;
  const visitors = visitorsByChannel[channel];
  const qualityFactor = qualityByChannel[channel];

  let activationRate = 0.20 * qualityFactor;
  if (state.activation.cta) activationRate += CONTROL_RATES.activation.cta;
  if (state.activation.friction) activationRate += CONTROL_RATES.activation.friction;

  let retentionRate = 0.40;
  if (state.retention.onboarding) retentionRate += CONTROL_RATES.retention.onboarding;
  if (state.retention.email) retentionRate += CONTROL_RATES.retention.email;

  let revenueRate = 0.20;
  if (state.revenue.trial) revenueRate += CONTROL_RATES.revenue.trial;
  if (state.revenue.pricing) revenueRate += CONTROL_RATES.revenue.pricing;

  let referralRate = 0.50;
  if (state.referral.factorReferrals) {
    if (state.referral.incentive) referralRate += CONTROL_RATES.referral.incentive;
    if (state.referral.share) referralRate += CONTROL_RATES.referral.share;
  }

  return { visitors, activationRate, retentionRate, revenueRate, referralRate };
}

export function computeFunnel(rates: ReturnType<typeof applyModifiers>) {
  const signups = rates.visitors * rates.activationRate;
  const active = signups * rates.retentionRate;
  const paid = active * rates.revenueRate;
  const referrals = active * rates.referralRate;
  return { visitors: rates.visitors, signups, active, paid, referrals };
}

export function computeTotalFunnel(state: AppState) {
  const baseRates = applyModifiers(state);
  const baseFunnel = computeFunnel(baseRates);

  if (state.referral.factorReferrals) {
    const refState: AppState = { ...state, acquisition: { channel: 'referral' }, referral: { ...state.referral, factorReferrals: false } };
    const refRates = applyModifiers(refState);
    refRates.visitors = baseFunnel.referrals;
    const refFunnel = computeFunnel(refRates);

    return {
      visitors: baseFunnel.visitors + refFunnel.visitors,
      signups: baseFunnel.signups + refFunnel.signups,
      active: baseFunnel.active + refFunnel.active,
      paid: baseFunnel.paid + refFunnel.paid,
      referrals: baseFunnel.referrals + refFunnel.referrals,
      plusvalence: refFunnel
    };
  }

  return { ...baseFunnel, plusvalence: null };
}

export function getImpact(state: AppState) {
  const currentFunnel = computeTotalFunnel(state);

  const baseAcquisitionState: AppState = { ...state, acquisition: { channel: 'x' } };
  const baseActivationState: AppState = { ...state, activation: { cta: false, friction: false } };
  const baseRetentionState: AppState = { ...state, retention: { onboarding: false, email: false } };
  const baseRevenueState: AppState = { ...state, revenue: { trial: false, pricing: false } };
  const baseReferralState: AppState = { ...state, referral: { incentive: false, share: false, factorReferrals: false } };

  const deltas: Record<FunnelSection, number> = {
    Acquisition: Math.round(currentFunnel.paid - computeTotalFunnel(baseAcquisitionState).paid),
    Activation: Math.round(currentFunnel.paid - computeTotalFunnel(baseActivationState).paid),
    Retention: Math.round(currentFunnel.paid - computeTotalFunnel(baseRetentionState).paid),
    Revenue: Math.round(currentFunnel.paid - computeTotalFunnel(baseRevenueState).paid),
    Referral: Math.round(currentFunnel.paid - computeTotalFunnel(baseReferralState).paid)
  };

  const topInsight: [FunnelSection | 'None', number] = Object.entries(deltas).reduce((a, b) => a[1] > b[1] ? a : b, ['None', 0]) as [FunnelSection | 'None', number];

  return { deltas, topInsight };
}

export default function GrowthFunnelSimulator() {
  // States
  const [acquisition, setAcquisition] = useState<AppState['acquisition']>({ channel: 'x' });
  const [activation, setActivation] = useState<AppState['activation']>({ cta: false, friction: false });
  const [retention, setRetention] = useState<AppState['retention']>({ onboarding: false, email: false });
  const [revenue, setRevenue] = useState<AppState['revenue']>({ trial: false, pricing: false });
  const [referral, setReferral] = useState<AppState['referral']>({ incentive: false, share: false, factorReferrals: false });

  // Calculations
  const metrics = useMemo(() => {
    const state = { acquisition, activation, retention, revenue, referral };
    const rates = applyModifiers(state);
    const funnel = computeTotalFunnel(state);
    const { deltas, topInsight } = getImpact(state);

    return { ...rates, ...funnel, deltas, topInsight };
  }, [acquisition, activation, retention, revenue, referral]);

  const topColor = metrics.topInsight[0] !== 'None' ? getColorsForStage(metrics.topInsight[0]) : getColorsForStage('Acquisition');

  return (
    <div className="min-h-screen bg-[#f3f4fa] text-slate-800 font-sans pb-12">
      {/* 1. Header */}
      <header className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col justify-center">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-[12px] shadow-sm">
            <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[28px] font-extrabold text-slate-900 tracking-[-0.02em]">Growth Funnel Simulator</h1>
            <p className="text-slate-500 mt-1 text-[15px] font-medium">See how changes impact user conversion</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-10 grid grid-cols-24 gap-8">

        {/* Left Column: Controls */}
        <section className="col-span-24 lg:col-span-7">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-white">
              <h2 className="text-xl font-bold text-slate-800">Controls</h2>
              <p className="text-sm text-slate-500">Adjust levers to see the impact</p>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              <div className="p-4 space-y-3">
                <div className="flex flex-col">
                  <div className="flex items-center text-blue-600 mb-3">
                    <Megaphone className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">Acquisition</h3>
                    <p className="text-xs text-slate-500 ml-auto">Where your users come from</p>
                  </div>
                  <div className="ml-7 relative">
                    <div className="relative">
                      <select
                        className="w-full pl-3 pr-8 py-2.5 border border-slate-200 rounded-lg text-sm bg-white appearance-none cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-colors"
                        value={acquisition.channel}
                        onChange={(e) => setAcquisition(prev => ({ ...prev, channel: e.target.value as Channel }))}
                      >
                        <option value="x">X (default)</option>
                        <option value="hn">Hacker News</option>
                        <option value="ads">Paid Ads</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1 pl-1 font-medium">{acquisition.channel === 'x' ? 'Low quality: Low intent, smaller volume' : acquisition.channel === 'hn' ? 'High quality: Tech audience, large spike' : 'Medium quality: Consistent baseline volume'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex flex-col mb-1">
                  <div className="flex items-center text-green-600 mb-1">
                    <Zap className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">Activation</h3>
                    <p className="text-xs text-slate-500 ml-auto">Turn visitors into signups</p>
                  </div>
                </div>
                <div className="ml-7">
                  <Toggle label="Improve CTA" impact={`+${Math.round(CONTROL_RATES.activation.cta * 100)}% signup`} colorClass="bg-green-600" active={activation.cta} onClick={() => setActivation(prev => ({ ...prev, cta: !prev.cta }))} />
                  <Toggle label="Reduce friction" impact={`+${Math.round(CONTROL_RATES.activation.friction * 100)}% signup`} colorClass="bg-green-600" active={activation.friction} onClick={() => setActivation(prev => ({ ...prev, friction: !prev.friction }))} />
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex flex-col mb-1">
                  <div className="flex items-center text-purple-600 mb-1">
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">Retention</h3>
                    <p className="text-xs text-slate-500 ml-auto">Turn signups into active users</p>
                  </div>
                </div>
                <div className="ml-7">
                  <Toggle label="Better onboarding" impact={`+${Math.round(CONTROL_RATES.retention.onboarding * 100)}% activation`} colorClass="bg-purple-600" active={retention.onboarding} onClick={() => setRetention(prev => ({ ...prev, onboarding: !prev.onboarding }))} />
                  <Toggle label="Email reminders" impact={`+${Math.round(CONTROL_RATES.retention.email * 100)}% activation`} colorClass="bg-purple-600" active={retention.email} onClick={() => setRetention(prev => ({ ...prev, email: !prev.email }))} />
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex flex-col mb-1">
                  <div className="flex items-center text-orange-600 mb-1">
                    <CircleDollarSign className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">Revenue</h3>
                    <p className="text-xs text-slate-500 ml-auto">Turn active users into paying</p>
                  </div>
                </div>
                <div className="ml-7">
                  <Toggle label="Free trial" impact={`+${Math.round(CONTROL_RATES.revenue.trial * 100)}% paid`} colorClass="bg-orange-600" active={revenue.trial} onClick={() => setRevenue(prev => ({ ...prev, trial: !prev.trial }))} />
                  <Toggle label="Better pricing" impact={`+${Math.round(CONTROL_RATES.revenue.pricing * 100)}% paid`} colorClass="bg-orange-600" active={revenue.pricing} onClick={() => setRevenue(prev => ({ ...prev, pricing: !prev.pricing }))} />
                </div>
              </div>

              <div className="p-4 space-y-1">
                <div className="flex flex-col mb-1">
                  <div className="flex items-center text-fuchsia-600 mb-1">
                    <Users className="w-5 h-5 mr-2" />
                    <h3 className="font-bold text-sm">Referral</h3>
                    <p className="text-xs text-slate-500 ml-auto">Turn paying users into referrers</p>
                  </div>
                </div>
                <div className="ml-7 space-y-1">
                  <div className="pb-2 border-b border-slate-100 mb-2">
                    <Toggle tooltip="Routes acquired referrals back into the funnel as high-intent users" label="Include referrals" impact="compounding" colorClass="bg-fuchsia-600" active={referral.factorReferrals} onClick={() => setReferral(prev => ({ ...prev, factorReferrals: !prev.factorReferrals }))} />
                  </div>
                  <Toggle label="Invite incentive" impact={`+${CONTROL_RATES.referral.incentive} referral`} colorClass="bg-fuchsia-600" active={referral.incentive} disabled={!referral.factorReferrals} onClick={() => setReferral(prev => ({ ...prev, incentive: !prev.incentive }))} />
                  <Toggle label="Share button" impact={`+${CONTROL_RATES.referral.share} referral`} colorClass="bg-fuchsia-600" active={referral.share} disabled={!referral.factorReferrals} onClick={() => setReferral(prev => ({ ...prev, share: !prev.share }))} />
                </div>
              </div>

            </div>
          </Card>
        </section>

        {/* Center Column: Funnel */}
        <section className="col-span-24 lg:col-span-9 flex flex-col">
          <Card className="p-6 h-full flex flex-col bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Funnel Overview</h2>
            <p className="text-sm text-slate-500 mb-6">Live results based on your selections</p>

            <div className="flex-1 flex flex-col items-center justify-start w-full px-4">
              <FunnelStep
                funnelSection="Acquisition"
                count={metrics.visitors}
                plusvalence={metrics.plusvalence?.visitors}
              />
              <FunnelStep
                funnelSection="Activation"
                count={metrics.signups}
                rate={metrics.activationRate}
                dropoff={metrics.visitors - metrics.signups}
                dropoffPercent={((metrics.visitors - metrics.signups) / metrics.visitors) * 100}
                plusvalence={metrics.plusvalence?.signups}
              />
              <FunnelStep
                funnelSection="Retention"
                count={metrics.active}
                rate={metrics.retentionRate}
                dropoff={metrics.signups - metrics.active}
                dropoffPercent={((metrics.signups - metrics.active) / metrics.signups) * 100}
                plusvalence={metrics.plusvalence?.active}
              />
              <FunnelStep
                funnelSection="Revenue"
                count={metrics.paid}
                rate={metrics.revenueRate}
                dropoff={metrics.active - metrics.paid}
                dropoffPercent={((metrics.active - metrics.paid) / metrics.active) * 100}
                plusvalence={metrics.plusvalence?.paid}
              />
              <FunnelStep
                funnelSection="Referral"
                count={metrics.referrals}
                rate={metrics.referralRate}
                dropoff={0}
                showTopArrow={true}
                plusvalence={metrics.plusvalence?.referrals}
                tooltip="Referrals are generated from all active users, not just paid users."
              />
            </div>
          </Card>
        </section>

        {/* Right Column: Insights */}
        <section className="col-span-24 lg:col-span-8 flex flex-col gap-6">
          <Card className="p-6 flex-1 flex flex-col bg-white">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Insights</h2>
            <p className="text-sm text-slate-500 mb-6">What's driving your results?</p>

            {metrics.topInsight[1] > 0 && (
              <div className={`${topColor.bg} border ${topColor.border} rounded-xl p-5 relative overflow-hidden mb-8`}>
                <div className={`absolute top-4 right-4 ${topColor.badge} text-white text-[10px] font-bold px-2 py-1 uppercase rounded tracking-wider`}>
                  Most Critical
                </div>
                <Lightbulb className={`${topColor.icon} w-8 h-8 mb-4 stroke-[1.5]`} />
                <h3 className="text-xl font-bold text-slate-900 mb-1">{metrics.topInsight[0]}</h3>
                <div className="flex items-end mb-3 mt-2">
                  <span className={`text-4xl font-bold ${topColor.text} leading-none`}>+{metrics.topInsight[1]}</span>
                  <span className={`text-xl ${topColor.text} ml-2 font-medium`}>paid users</span>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  If we removed {metrics.topInsight[0].toLowerCase()} improvements, you'd have {metrics.topInsight[1]} fewer paid users.
                </p>
              </div>
            )}

            {metrics.topInsight[1] > 0 ? (
              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">Impact by Step <span className="text-slate-400 font-normal ml-1 text-sm">(paid users)</span></h3>
                <div className="space-y-4">
                  {Object.entries(metrics.deltas)
                    .filter(([, val]) => val > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([key, val]) => (
                      <div key={key} className="flex items-center">
                        <div className="w-24 text-sm font-medium text-slate-700">{key}</div>
                        <div className="flex-1 flex items-center h-4 relative">
                          <div className={`h-2 ${getColorsForStage(key as FunnelSection).badge} rounded-full`} style={{ width: `${Math.max(4, (val / metrics.topInsight[1]) * 100)}%`, minWidth: '8px' }}></div>
                        </div>
                        <div className="w-8 text-right text-sm font-bold text-slate-800">+{val}</div>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
                  Calculated by comparing current state vs. removing each improvement.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 mt-8">
                <Lightbulb className="w-12 h-12 mb-3 text-slate-200" />
                <p className="text-sm font-medium text-slate-500">No impact to show yet</p>
                <p className="text-xs mt-1">Enable improvements to see their impact here.</p>
              </div>
            )}
          </Card>

          {/* Bottom Section: What I'd Test Next */}
          <Card className="p-5 bg-white shrink-0">
            <h2 className="text-lg font-bold text-slate-800 mb-1">What to Test Next</h2>
            <p className="text-xs text-slate-500 mb-5">Based on existing funnel opportunities</p>

            <div className="flex flex-col gap-3">
              {!activation.cta && !activation.friction && (
                <ExperimentSuggestion
                  icon={Target}
                  title="Reduce signup friction"
                  description={`Signup rate could improve by ${Math.round(CONTROL_RATES.activation.friction * 100)}% with a simpler flow.`}
                  funnelSection="Activation"
                />
              )}

              {!activation.cta && activation.friction && (
                <ExperimentSuggestion
                  icon={Target}
                  title="Improve CTA"
                  description={`Signup rate could improve by ${Math.round(CONTROL_RATES.activation.cta * 100)}% with clearer calls-to-action.`}
                  funnelSection="Activation"
                />
              )}

              {activation.cta && !activation.friction && (
                <ExperimentSuggestion
                  icon={Target}
                  title="Reduce signup friction"
                  description={`Signup rate could improve by ${Math.round(CONTROL_RATES.activation.friction * 100)}% with a simpler flow.`}
                  funnelSection="Activation"
                />
              )}

              {!retention.onboarding && !retention.email && (
                <ExperimentSuggestion
                  icon={Rocket}
                  title="Improve onboarding"
                  description={`Activation could improve by ${Math.round(CONTROL_RATES.retention.onboarding * 100)}% with better guidance.`}
                  funnelSection="Retention"
                />
              )}

              {!retention.onboarding && retention.email && (
                <ExperimentSuggestion
                  icon={Rocket}
                  title="Improve onboarding"
                  description={`Activation could improve by ${Math.round(CONTROL_RATES.retention.onboarding * 100)}% with better guidance.`}
                  funnelSection="Retention"
                />
              )}

              {retention.onboarding && !retention.email && (
                <ExperimentSuggestion
                  icon={Mail}
                  title="Try email re-engagement"
                  description={`Activation could improve by ${Math.round(CONTROL_RATES.retention.email * 100)}% with email reminders.`}
                  funnelSection="Retention"
                />
              )}

              {!revenue.trial && !revenue.pricing && (
                <ExperimentSuggestion
                  icon={CircleDollarSign}
                  title="Offer free trial"
                  description={`Revenue could improve by ${Math.round(CONTROL_RATES.revenue.trial * 100)}% with a trial offer.`}
                  funnelSection="Revenue"
                />
              )}

              {!revenue.trial && revenue.pricing && (
                <ExperimentSuggestion
                  icon={CircleDollarSign}
                  title="Offer free trial"
                  description={`Revenue could improve by ${Math.round(CONTROL_RATES.revenue.trial * 100)}% with a trial offer.`}
                  funnelSection="Revenue"
                />
              )}

              {revenue.trial && !revenue.pricing && (
                <ExperimentSuggestion
                  icon={CircleDollarSign}
                  title="Optimize pricing"
                  description={`Revenue could improve by ${Math.round(CONTROL_RATES.revenue.pricing * 100)}% with better pricing strategy.`}
                  funnelSection="Revenue"
                />
              )}

              {referral.factorReferrals && !referral.incentive && !referral.share && (
                <ExperimentSuggestion
                  icon={Users}
                  title="Add share button"
                  description={`Referrals could increase by ${CONTROL_RATES.referral.share} per user with easy sharing.`}
                  funnelSection="Referral"
                />
              )}

              {referral.factorReferrals && !referral.incentive && referral.share && (
                <ExperimentSuggestion
                  icon={Users}
                  title="Add invite incentive"
                  description={`Referrals could increase by ${CONTROL_RATES.referral.incentive} per user with incentives.`}
                  funnelSection="Referral"
                />
              )}

              {referral.factorReferrals && referral.incentive && !referral.share && (
                <ExperimentSuggestion
                  icon={Users}
                  title="Add share button"
                  description={`Referrals could increase by ${CONTROL_RATES.referral.share} per user with easy sharing.`}
                  funnelSection="Referral"
                />
              )}

              {!referral.factorReferrals && (
                <ExperimentSuggestion
                  icon={Users}
                  title="Enable referral loop"
                  description="Turn users into referrers for compounding growth."
                  funnelSection="Referral"
                />
              )}

              {activation.cta && activation.friction && retention.onboarding && retention.email && revenue.trial && revenue.pricing && referral.factorReferrals && referral.incentive && referral.share && (
                <div className="flex items-center justify-center p-6 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-sm text-slate-500 font-medium">All experiments enabled! Great job.</p>
                </div>
              )}
            </div>
          </Card>
        </section>

      </main>
    </div>
  )
}