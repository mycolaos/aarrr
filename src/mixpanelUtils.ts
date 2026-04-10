import mixpanel from 'mixpanel-browser';

const AB_TEST_STORAGE_KEY = 'insights_column_ab_test_variant';
const VARIANT_OPTIONS = ['with_insight', 'without_insight'] as const;

export type ABTestVariant = typeof VARIANT_OPTIONS[number];

export function getABTestVariant(): ABTestVariant {
  const stored = localStorage.getItem(AB_TEST_STORAGE_KEY);
  if (stored === 'with_insight' || stored === 'without_insight') {
    return stored;
  }
  
  const variant = VARIANT_OPTIONS[Math.floor(Math.random() * VARIANT_OPTIONS.length)];
  localStorage.setItem(AB_TEST_STORAGE_KEY, variant);
  return variant;
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  const variant = getABTestVariant();
  mixpanel.track(eventName, {
    ...properties,
    variant,
  });
}

export function setABTestVariant(variant: ABTestVariant) {
  localStorage.setItem(AB_TEST_STORAGE_KEY, variant);
}
