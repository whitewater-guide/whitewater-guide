import { trackError } from './trackError';

export const configErrors = () => {
  if (__DEV__) {
    return;
  }
  const ErrorUtils = (global as any).ErrorUtils;
  const defaultHandler = ErrorUtils.getGlobalHandler();

  ErrorUtils.setGlobalHandler((error: Error, isFatal) => {
    trackError('global', error, undefined, isFatal);
    defaultHandler.apply(error, isFatal);
  });
};
