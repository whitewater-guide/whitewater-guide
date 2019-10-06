import React from 'react';
import isApolloOfflineError from '../utils/isApolloOfflineError';
import Loading from './Loading';
import RetryPlaceholder from './RetryPlaceholder';

interface Props {
  data: any;
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
}

interface State {
  refetching: boolean;
}

class WithNetworkError extends React.PureComponent<Props, State> {
  readonly state: State = { refetching: false };

  render() {
    const { refetching } = this.state;
    const { data, error, loading, refetch, children } = this.props;
    if (refetching || isApolloOfflineError(error, data)) {
      const refetchFromError = async () => {
        this.setState({ refetching: true });
        await refetch().finally(() => {
          this.setState({ refetching: false });
        });
      };
      return <RetryPlaceholder refetch={refetchFromError} loading={loading} />;
    }
    if (loading && !data) {
      return <Loading />;
    }
    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default WithNetworkError;
