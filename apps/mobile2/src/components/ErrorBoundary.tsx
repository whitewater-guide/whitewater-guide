import type { ErrorInfo, PropsWithChildren, ReactNode } from 'react';
import { Component } from 'react';

import RetryPlaceholder from './RetryPlaceholder';

interface State {
  hasError: boolean;
}

interface Props {
  children?: ReactNode;
}

class ErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <RetryPlaceholder refetch={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
