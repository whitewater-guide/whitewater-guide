import Config from 'react-native-config';
import { Sentry } from 'react-native-sentry';
import { versioning } from '../../utils/versioning';
import { trackError } from './trackError';

export const configErrors = () => {
  Sentry.config(Config.SENTRY_DSN)
    .install()
    .then(() => {
      Sentry.setTagsContext({ environment: Config.ENV_NAME });
    })
    .then(versioning.getCodePushVersion)
    .then(({ local }) => {
      const jsVersion = versioning.getJsVersion();
      Sentry.setVersion(`${jsVersion}${local || 'v0'}`);
    });

  if (__DEV__) {
    return;
  }
  const ErrorUtils = (global as any).ErrorUtils;
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    trackError('global', error, undefined, isFatal);
    defaultHandler(error, isFatal);
  });
};
