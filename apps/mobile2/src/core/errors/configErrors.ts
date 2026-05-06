import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

import { tracker } from './tracker';

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    integrations: [navigationIntegration],
    tracesSampleRate: __DEV__ ? 0 : 0.1,
    beforeBreadcrumb: (breadcrumb) => {
      const { category = 'default', data = {}, message = '' } = breadcrumb;
      const statusCode = Number(data.status_code);
      const url: string | undefined = data.url;
      if (
        ['console', 'device.orientation', 'ui.lifecycle'].includes(category) ||
        (['xhr', 'http'].includes(category) &&
          (statusCode === 0 ||
            (statusCode >= 200 && statusCode < 300) ||
            url?.includes('localhost:8081'))) ||
        (category === 'device.event' &&
          data.action === 'BATTERY_STATE_CHANGE') ||
        (category === 'touch' && message.startsWith('handleTouch'))
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
  tracker.ready();
};
