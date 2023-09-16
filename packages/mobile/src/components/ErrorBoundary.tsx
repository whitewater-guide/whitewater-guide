import * as Sentry from '@sentry/react';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface Props {
  logger?: string;
}

export const ErrorBoundary: FC<PropsWithChildren<Props>> = ({
  children,
  logger,
}) => {
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
