import * as Sentry from '@sentry/react-native';
import Config from 'react-native-ultimate-config';

import { tracker } from './tracker';

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    enabled: !__DEV__,
    // integrations: (items) => items.filter((i) => i.name !== 'Breadcrumbs'),
    beforeBreadcrumb: (breadcrumb) => {
      if (
        // This just spams useless rn logs
        breadcrumb.category === 'console' ||
        // Usually we don't care about successful requests
        // EqEq because different versions of sentry use string or number
        // eslint-disable-next-line eqeqeq
        (breadcrumb.category === 'xhr' && breadcrumb.data?.status_code == 200)
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
  tracker.ready();
};
