import Analytics from 'appcenter-analytics';

export const trackError = (error: {[key: string]: any}) =>
  Analytics.trackEvent('error', error);
