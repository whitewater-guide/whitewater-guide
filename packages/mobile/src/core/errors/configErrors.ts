import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import { versioning } from '../../utils/versioning';
import { tracker } from './tracker';

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    enabled: !__DEV__,
    integrations: (items) => items.filter((i) => i.name !== 'Breadcrumbs'),
  });
  versioning.getSentryVersion().then((sentryVersion: any) => {
    Sentry.setRelease(sentryVersion);
    Sentry.setDist(versioning.getDist());
    tracker.ready();
  });
};
