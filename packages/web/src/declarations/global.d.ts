import '@testing-library/jest-dom/extend-expect';

import type { addBreadcrumb, init } from '@sentry/react';

declare global {
  interface SentryLike {
    init: typeof init;
    addBreadcrumb: typeof addBreadcrumb;
  }

  declare const Sentry: SentryLike;

  declare namespace NodeJS {
    export interface ProcessEnv {
      REACT_APP_VERSION: string;
      REACT_APP_GOOGLE_API_KEY: string;
      REACT_APP_API: string;
      REACT_APP_S3: string;
      REACT_APP_FACEBOOK_APP_ID: string;
      REACT_APP_SENTRY_DSN: string;
    }
  }
}
