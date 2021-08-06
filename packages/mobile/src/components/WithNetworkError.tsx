import React, { memo } from 'react';

import Loading from './Loading';
import RetryPlaceholder from './RetryPlaceholder';

interface Props {
  hasData: boolean;
  hasError: boolean;
  loading: boolean;
  refetch: () => Promise<any>;
  children?: any;
}

const WithNetworkError = memo<Props>(
  ({ hasData, hasError, loading, refetch, children }) => {
    if (loading && !hasData) {
      return <Loading />;
    }
    if (hasError && !hasData) {
      return <RetryPlaceholder refetch={refetch} loading={loading} />;
    }
    return children;
  },
);

export default WithNetworkError;
