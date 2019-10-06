import analytics from '@react-native-firebase/analytics';
import * as Sentry from '@sentry/react-native';

interface Trace {
  logger: string;
  transactionId?: string;
  error: Error;
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
    const { logger, transactionId, error, extra } = trace;
    if (__DEV__) {
      try {
        console.dir(error);
      } catch {
        // tslint:disable-next-line:no-console
        console.log(error);
      }
    }
    if (!this._ready) {
      this._queue.push(trace);
      return;
    }
    Sentry.withScope((scope) => {
      scope.setTag('logger', logger);
      if (transactionId) {
        scope.setTransaction(transactionId);
      }
      if (extra) {
        scope.setExtras(extra);
      }
      Sentry.captureException(error);
    });
  };

  setScreen = (screen: string, params: any) => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      level: Sentry.Severity.Info,
      message: screen,
      data: params,
    });
    analytics().setCurrentScreen(screen);
  };

  setUser = (user: any) => {
    Sentry.setUser(user);
  };
}

export const tracker = new ErrorTracker();
