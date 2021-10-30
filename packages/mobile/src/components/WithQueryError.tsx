import { ApolloError } from '@apollo/client';
import React, { memo } from 'react';

import Loading from './Loading';
import RetryPlaceholder from './RetryPlaceholder';

interface Props {
  hasData: boolean;
  error?: ApolloError | null;
  loading: boolean;
  refetch: () => void;
  children?: any;
  testID?: string;
}

const WithQueryError = memo<Props>(
  ({ hasData, error, loading, refetch, children }) => {
    if (loading && !hasData) {
      return <Loading />;
    }

    if (!!error && !hasData) {
      return (
        <RetryPlaceholder refetch={refetch} loading={loading} error={error} />
      );
    }

    return children;
  },
);

WithQueryError.displayName = 'WithQueryError';

export default WithQueryError;
