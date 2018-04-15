import Analytics from 'appcenter-analytics';

export const trackError = (origin: string, error: {[key: string]: any}) =>
  Analytics.trackEvent('error', { origin, error: JSON.stringify(error) });
