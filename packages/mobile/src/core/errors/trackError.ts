import { AppError } from '@whitewater-guide/clients';
import { tracker } from './tracker';

export const trackError = (
  logger: string,
  error: Error,
  componentStack?: string,
  isFatal?: boolean,
) => {
  if (error instanceof AppError) {
    tracker.track({
      error,
      logger,
      extra: {
        isFatal,
        componentStack,
        original: error.original,
        error_id: error.id,
      },
    });
  } else {
    tracker.track({ error, logger, extra: { isFatal, componentStack } });
  }
};
