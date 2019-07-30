import { addBreadcrumb, init } from '@sentry/browser';
// tslint:disable-next-line:no-submodule-imports
import '@testing-library/jest-dom/extend-expect';

declare global {
  interface Window {
    RUNTIME_API: string;
    RUNTIME_S3: string;
    RUNTIME_FACEBOOK_APP_ID: string;
  }

  interface SentryLike {
    init: typeof init;
    addBreadcrumb: typeof addBreadcrumb;
  }

  declare const Sentry: SentryLike;
}
