declare module 'react-error-boundary' {
  import * as React from 'react';

  interface FallbackProps {
    error?: Error;
    componentStack?: string;
  }

  interface Props {
    onError?: (error: Error, componentStack: string) => void;
    FallbackComponent?: React.ComponentType<FallbackProps>;
  }

  class ErrorBoundary extends React.Component<Props> {

  }

  export default ErrorBoundary;
}
