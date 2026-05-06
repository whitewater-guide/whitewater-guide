import * as Sentry from '@sentry/react-native';

interface Trace {
  logger: string;
  error: unknown;
  extra?: Record<string, any>;
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
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(trace.error);
    }
    if (!this._ready) {
      this._queue.push(trace);
      return;
    }
    Sentry.captureException(trace.error, {
      tags: { logger: trace.logger },
      extra: trace.extra,
    });
  };

  setUser = (user: Sentry.User | null) => Sentry.setUser(user);
}

export const tracker = new ErrorTracker();
