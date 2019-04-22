import { tracker } from './tracker';

export const trackError = (
  logger: string,
  error: Error,
  componentStack?: string,
  isFatal?: boolean,
) => {
  tracker.track({ error, logger, isFatal, componentStack });
};
