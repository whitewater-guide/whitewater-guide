import { Sentry, SentrySeverity } from 'react-native-sentry';

interface Trace {
  logger: string;
  error: Error;
  extra: { [key: string]: any };
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
    if (!__DEV__) {
      Sentry.captureException(error, { logger, extra });
    }
  };

  setScreen = (screen: string, params: any) => {
    if (!__DEV__) {
      Sentry.captureBreadcrumb({
        category: 'navigation',
        level: SentrySeverity.Info,
        message: screen,
        data: params,
      });
    }
  };
}

export const tracker = new ErrorTracker();
