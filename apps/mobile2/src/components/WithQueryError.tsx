import type { ApolloError } from '@apollo/client';
import React, { memo } from 'react';

import Loading from './Loading';
import RetryPlaceholder from './RetryPlaceholder';

interface Props {
  hasData: boolean;
  error?: ApolloError | null;
  loading: boolean;
  refetch: () => void;
  children?: React.ReactNode;
}

function WithQueryError({ hasData, error, loading, refetch, children }: Props) {
  if (loading && !hasData) {
    return <Loading />;
  }
  if (!!error && !hasData) {
    return (
      <RetryPlaceholder refetch={refetch} loading={loading} error={error} />
    );
  }
  return children;
}

export default memo(WithQueryError);
