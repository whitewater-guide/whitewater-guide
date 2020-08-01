import * as Sentry from '@sentry/react-native';
import Config from 'react-native-ultimate-config';
import { tracker } from './tracker';

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    enabled: !__DEV__,
    integrations: (items) => items.filter((i) => i.name !== 'Breadcrumbs'),
  });
  tracker.ready();
};
