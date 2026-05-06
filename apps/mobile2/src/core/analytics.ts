import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserProperty,
} from '@react-native-firebase/analytics';

const a = () => getAnalytics();

export const trackScreen = (name: string) =>
  logScreenView(a(), { screen_name: name, screen_class: name }).catch(() => {});

export const trackEvent = (name: string, params?: Record<string, unknown>) =>
  logEvent(a(), name, params).catch(() => {});

export const setUserProp = (key: string, value: string | null) =>
  setUserProperty(a(), key, value).catch(() => {});
