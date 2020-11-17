import { Page } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import { QueryHookOptions, QueryResult, useQuery } from 'react-apollo';

import { getListMerger } from './getListMerger';

const getConnectionField = <QResult>(data: QResult): null | keyof QResult => {
  if (!data) {
    return null;
  }
  const connectionFields = Object.keys(data);
  if (connectionFields && connectionFields.length === 0) {
    return null;
  }
  if (connectionFields && connectionFields.length !== 1) {
    throw new Error(
      'query must have single selection set, but found many: ' +
        connectionFields.join(', '),
    );
  }
  return connectionFields[0] as any;
};

export const useStreamingQuery = <QResult, QVars extends { page?: Page }>(
  query: DocumentNode,
  options: QueryHookOptions<QResult, QVars> = {},
  limit = 20,
): Omit<QueryResult<QResult, QVars>, 'fetchMore'> => {
  const { data, fetchMore, ...rest } = useQuery<QResult, QVars>(query, {
    ...options,
    variables: { ...options.variables, page: { limit } } as any,
  });
  const connectionField = getConnectionField(data);
  const loaded = connectionField
    ? (data![connectionField] as any).nodes.length
    : -1;
  const total = connectionField ? (data![connectionField] as any).count : -1;
  useEffect(() => {
    if (loaded < total) {
      fetchMore({
        query,
        variables: {
          ...options.variables,
          page: { limit, offset: loaded },
        },
        updateQuery: getListMerger(connectionField as any),
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, total, connectionField]);

  return { data, ...rest };
};
