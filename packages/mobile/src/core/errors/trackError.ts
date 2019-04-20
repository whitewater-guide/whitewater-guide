import { Sentry } from 'react-native-sentry';

export const trackError = (
  origin: string,
  error: Error,
  componentStack?: string,
  isFatal?: boolean,
) => {
  if (__DEV__) {
    try {
      console.dir(error);
    } catch {
      // tslint:disable-next-line:no-console
      console.log(error);
    }
  }
  if (!__DEV__) {
    Sentry.captureException(error, { origin, isFatal, componentStack });
  }
};
