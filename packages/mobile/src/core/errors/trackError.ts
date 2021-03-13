import { AppError } from '@whitewater-guide/clients';
import stringify from 'fast-json-stable-stringify';

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
        // @ts-expect-error: fast-json-stable-stringify definitions are incomplete
        original: stringify(error.original, { cycles: true }),
      },
    });
  } else {
    tracker.track({ error, logger, transactionId, extra });
  }
};
