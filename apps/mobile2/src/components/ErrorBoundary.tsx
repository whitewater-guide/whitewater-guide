import * as Sentry from '@sentry/react-native';
import type { PropsWithChildren } from 'react';

import RetryPlaceholder from './RetryPlaceholder';

interface Props {
  logger?: string;
}

function ErrorBoundary({ children, logger }: PropsWithChildren<Props>) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => <RetryPlaceholder refetch={resetError} />}
      beforeCapture={(scope) => {
        if (logger) {
          scope.setTag('logger', logger);
        }
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
