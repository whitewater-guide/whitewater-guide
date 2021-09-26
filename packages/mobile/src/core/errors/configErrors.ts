import * as Sentry from '@sentry/react-native';
import Config from 'react-native-ultimate-config';

import { tracker } from './tracker';

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    beforeBreadcrumb: (breadcrumb) => {
      const statusCode = Number(breadcrumb.data?.status_code);
      const url: string | undefined = breadcrumb.data?.url;
      if (
        // This just spams useless rn logs
        breadcrumb.category === 'console' ||
        (breadcrumb.category === 'xhr' &&
          // Usually we don't care about successful requests
          ((statusCode >= 200 && statusCode < 300) ||
            // and aboute RN dev server
            url?.includes('localhost:8081')))
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
  tracker.ready();
};
