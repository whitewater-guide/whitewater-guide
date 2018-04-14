declare module 'react-error-boundary' {
  import React from 'react';

  export interface FallbackProps {
    error?: Error;
    componentStack?: string;
  }

  export interface ErrorBoundaryProps {
    onError?: (error: Error, componentStack: string) => void;
    FallbackComponent?: React.ComponentType<FallbackProps>;
  }

  export function withErrorBoundary<P>(
    ComponentToDecorate: React.ComponentType<P>,
    CustomFallbackComponent?: React.ComponentType<FallbackProps>,
    onErrorHandler?: (error: Error, componentStack: string) => void,
  ): React.ComponentType<P>;

  type ErrorBoundaryStatic = React.ComponentType<ErrorBoundaryProps>;
  export const ErrorBoundary: ErrorBoundaryStatic;
  export type ErrorBoundary = ErrorBoundaryStatic;
}
