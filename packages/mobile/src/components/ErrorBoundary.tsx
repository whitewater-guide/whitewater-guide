import * as Sentry from '@sentry/react';
import React, { FC } from 'react';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface Props {
  logger?: string;
}

export const ErrorBoundary: FC<Props> = ({ children, logger }) => {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack, eventId }) => (
        <ErrorBoundaryFallback
          error={error}
          componentStack={componentStack}
          eventId={eventId}
        />
      )}
      beforeCapture={(scope) => {
        if (logger) {
          scope.setTag('logger', logger);
        }
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
