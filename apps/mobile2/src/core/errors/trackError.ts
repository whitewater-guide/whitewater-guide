import { tracker } from './tracker';

export function trackError(
  logger: string,
  error: unknown,
  extra?: { [key: string]: any },
) {
  tracker.track({ error, logger, extra });
}
