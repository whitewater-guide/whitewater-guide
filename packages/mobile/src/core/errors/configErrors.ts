import * as Sentry from '@sentry/react-native';
import Config from 'react-native-ultimate-config';

import { tracker } from './tracker';

export const configErrors = () => {
  Sentry.init({
    dsn: Config.SENTRY_DSN,
    environment: Config.ENV_NAME,
    beforeBreadcrumb: (breadcrumb) => {
      const { category = 'default', data = {}, message = '' } = breadcrumb;
      const statusCode = Number(data.status_code);
      const url: string | undefined = data.url;
      if (
        // These categories are meaningless:
        // console - we do not log into console. RN logs some useless info
        // device.orientation - we're always in portrait mode
        // ui.lifecycle - these are just {screen: RNSScreen} and {screen: RNScreensViewController}
        ['console', 'device.orientation', 'ui.lifecycle'].includes(category) ||
        (['xhr', 'http'].includes(category) &&
          // Usually we don't care about successful requests
          (statusCode === 0 ||
            (statusCode >= 200 && statusCode < 300) ||
            // and aboute RN dev server
            url?.includes('localhost:8081'))) ||
        // this is also spam
        (category === 'device.event' &&
          data.action === 'BATTERY_STATE_CHANGE') ||
        // this is also spam by GestureHandleer
        (category === 'touch' && message.startsWith('handleTouch'))
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
  tracker.ready();
};
