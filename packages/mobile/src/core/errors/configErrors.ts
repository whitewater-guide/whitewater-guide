import Config from 'react-native-config';
import { Sentry } from 'react-native-sentry';
import { versioning } from '../../utils/versioning';
import { trackError } from './trackError';

export const configErrors = () => {
  if (__DEV__) {
    return;
  }

  Sentry.config(Config.SENTRY_DSN)
    .install()
    .then(() => {
      Sentry.setTagsContext({ environment: Config.ENV_NAME });
    })
    .then(() => versioning.getSentryVersion())
    .then((version) => {
      // tslint:disable-next-line:no-console
      console.log('[CODE PUSH SENTRY]', version);
      Sentry.setVersion(version);
    });

  const ErrorUtils = (global as any).ErrorUtils;
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    trackError('global', error, undefined, isFatal);
    defaultHandler(error, isFatal);
  });
};
