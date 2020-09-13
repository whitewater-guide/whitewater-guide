/* eslint-disable prefer-spread */
import {
  captureEvent,
  captureException,
  Severity,
  withScope,
} from '@sentry/node';
import pickBy from 'lodash/pickBy';
import pino, { LogFn } from 'pino';

import config from '~/config';

interface Bindings {
  [key: string]: string | undefined;
}

interface Payload {
  error?: Error;
  tags?: Bindings;
  extra?: any;
  message?: string;
  userId?: string;
}

class Logger {
  private _logger: pino.Logger;
  private _bindings?: Bindings;

  constructor(logger?: pino.Logger) {
    this._logger =
      logger ||
      pino({
        level: config.logLevel,
        prettyPrint:
          process.env.NODE_ENV === 'development'
            ? ({
                colorize: true,
                levelFirst: true,
              } as any)
            : false,
      });
  }

  child(bindings: Bindings) {
    const chld = new Logger(this._logger.child(bindings));
    chld._bindings = bindings;
    return chld;
  }

  logSentry = (
    { error, extra, message, tags, userId }: Payload,
    level: Severity,
  ) => {
    if (!process.env.SENTRY_DSN) {
      return;
    }
    if (error) {
      withScope((scope) => {
        scope.setLevel(level);
        scope.setExtras(extra);
        if (tags) {
          scope.setTags(pickBy(tags) as any);
        }
        if (userId) {
          scope.setUser({ id: userId });
        }
        if (message) {
          scope.setTag('code', message);
        }
        captureException(error);
      });
    } else {
      captureEvent({
        level,
        message,
        extra,
        tags: { ...(pickBy(tags) as any), ...this._bindings },
        user: { id: userId },
      });
    }
  };

  getPinoPayload = ({ error, extra, message, tags }: Payload) => {
    const mergingObject: any = { ...extra, ...tags };
    let msg = message;
    if (error) {
      mergingObject.error = error;
      msg = msg || error.message;
    }
    return [mergingObject, msg];
  };

  error = (payload: Payload) => {
    this.logSentry(payload, Severity.Error);
    this._logger.error.apply(this._logger, this.getPinoPayload(payload));
  };

  warn = (payload: Payload) => {
    this.logSentry(payload, Severity.Warning);
    this._logger.warn.apply(this._logger, this.getPinoPayload(payload));
  };

  info: LogFn = (...args: any[]) => {
    this._logger.info.apply(this._logger, args);
  };

  debug: LogFn = (...args: any[]) => {
    this._logger.debug.apply(this._logger, args);
  };
}

const log = new Logger();

export default log;
