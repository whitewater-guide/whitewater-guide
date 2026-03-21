import { tracker } from './tracker';

/**
 * This function wraps sentry error tracking
 * @param logger
 * @param error
 * @param extra
 */
export function trackError(
  logger: string,
  error: unknown,
  extra?: { [key: string]: any },
) {
  tracker.track({ error, logger, extra });
}
