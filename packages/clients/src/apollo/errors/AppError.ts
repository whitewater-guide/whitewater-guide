import get from 'lodash/get';
import { generate } from 'shortid';

export type AppErrorType = 'auth' | 'default';

/**
 * Client-side error intended to be displayed to end user and sent to sentry
 * Message is i18n key
 */
export class AppError<T = any> extends Error {
  public id: string; // to be matched with backend error where relevant
  public type: AppErrorType;
  public original?: T;

  constructor(original?: T, type?: AppErrorType, id?: string) {
    const message =
      get(original, 'message') ||
      get(original, 'networkError.message') ||
      get(original, 'graphQLErrors.0.message') ||
      'unknown error';
    super(message);
    this.type = type || 'default';
    this.id =
      id ||
      get(original, 'body.error_id') ||
      get(original, 'networkError.result.error_id') ||
      get(original, 'graphQLErrors.0.extensions.id') ||
      generate();
    this.original = original;
  }
}
