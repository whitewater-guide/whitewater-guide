import { init } from '@sentry/browser';

declare global {
  interface Window {
    RUNTIME_API: string;
    RUNTIME_S3: string;
    RUNTIME_FACEBOOK_APP_ID: string;
  }

  interface SentryLike {
    init: typeof init;
  }

  declare const Sentry: SentryLike;
}
