import { AppError } from '@whitewater-guide/clients';
import { tracker } from './tracker';

export const trackError = (
  logger: string,
  error: Error,
  extra?: { [key: string]: any },
  transactionId?: string,
) => {
  if (error instanceof AppError) {
    tracker.track({
      error,
      logger,
      transactionId: error.id,
      extra: {
        original: error.original,
      },
    });
  } else {
    tracker.track({ error, logger, transactionId, extra });
  }
};
