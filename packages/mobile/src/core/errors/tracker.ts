import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';

interface Trace {
  logger: string;
  error: unknown;
  extra?: { [key: string]: any };
}

class ErrorTracker {
  private _queue: Trace[] = [];

  private _ready = false;

  ready = () => {
    this._ready = true;
    this._queue.forEach(this.track);
    this._queue = [];
  };

  track = (trace: Trace) => {
    const { logger, error, extra } = trace;
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    if (!this._ready) {
      this._queue.push(trace);
      return;
    }
    Sentry.captureException(error, {
      tags: { logger },
      extra,
    });
  };

  trackScreen = (from: string, to: string, _params?: any) => {
    Sentry.addBreadcrumb({
      type: 'navigation',
      category: 'navigation',
      data: {
        from,
        to,
      },
    });
    analytics().logScreenView({ screen_name: to });
  };

  setUser = (user: any) => {
    Sentry.setUser(user);
  };
}

export const tracker = new ErrorTracker();
