import { Connection, Page } from '@whitewater-guide/commons';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import { QueryHookOptions, QueryResult, useQuery } from 'react-apollo';
import { getListMerger } from './queryResultToList';

export const useStreamingQuery = <QResult, QVars extends { page?: Page }>(
  query: DocumentNode,
  options: QueryHookOptions<QResult, QVars> = {},
  limit = 20,
): Omit<QueryResult<QResult, QVars>, 'fetchMore'> => {
  const { data, fetchMore, ...rest } = useQuery<QResult, QVars>(query, options);
  useEffect(() => {
    if (!data) {
      return;
    }
    const connectionFields: Array<keyof QResult> = Object.keys(data) as any;
    if (connectionFields && connectionFields.length === 0) {
      return;
    }
    if (connectionFields && connectionFields.length !== 1) {
      console.dir(data);
      throw new Error(
        'query must have single selection set, but found many: ' +
          connectionFields.join(', '),
      );
    }
    const connectionField = connectionFields[0];
    const connection: Connection<any> = data[connectionField];
    if (!connection.nodes || connection.count === undefined) {
      throw new Error('nodes and count must both be selected');
    }
    const numNodes = connection.nodes.length;
    if (numNodes < connection.count) {
      fetchMore({
        query,
        variables: {
          ...options.variables,
          page: { limit, offset: numNodes },
        },
        updateQuery: getListMerger(connectionField as any),
      }).catch(() => {});
    }
  }, [data]);

  return { data, ...rest };
};
