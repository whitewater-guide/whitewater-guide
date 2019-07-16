import Config from 'react-native-config';
import { Sentry } from 'react-native-sentry';
import { versioning } from '../../utils/versioning';
import { tracker } from './tracker';
import { trackError } from './trackError';

export const configErrors = () => {
  if (__DEV__) {
    return;
  }

  // @ts-ignore
  Sentry.config(Config.SENTRY_DSN, { autoBreadcrumbs: false })
    .install()
    .then(() => {
      Sentry.setTagsContext({ environment: Config.ENV_NAME });
    })
    .then(() => versioning.getSentryVersion())
    .then((sentryVersion: any) => {
      Sentry.setRelease(sentryVersion);
      Sentry.setDist(versioning.getDist());
      tracker.ready();
    });

  const ErrorUtils = (global as any).ErrorUtils;
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    trackError('global', error, undefined, isFatal);
    defaultHandler(error, isFatal);
  });
};
