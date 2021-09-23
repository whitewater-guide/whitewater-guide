import { tracker } from './tracker';

export const trackError = (
  logger: string,
  error: Error,
  extra?: { [key: string]: any },
  transactionId?: string,
) => {
  tracker.track({ error, logger, transactionId, extra });
};
