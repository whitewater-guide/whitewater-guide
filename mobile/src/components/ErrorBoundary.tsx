import React, { ErrorInfo } from 'react';

import { trackError } from '../core/errors';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

interface Props {
  logger?: string;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

class ErrorBoundary extends React.PureComponent<Props, State> {
  readonly state: State = {
    error: null,
    info: null,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { logger = 'errorBoundary' } = this.props;
    trackError(logger, error, { componentStack: info.componentStack });
    this.setState({ error, info });
  }

  render() {
    const { children } = this.props;
    const { error, info } = this.state;

    if (error) {
      return <ErrorBoundaryFallback error={error} info={info} />;
    }

    return children || null;
  }
}

export default ErrorBoundary;
