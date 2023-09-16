import type { QueryHookOptions, QueryResult } from '@apollo/client';
import { useQuery } from '@apollo/client';
import type { Maybe, Page } from '@whitewater-guide/schema';
import type { DocumentNode } from 'graphql';
import { useEffect, useRef } from 'react';

function getConnectionField<QResult>(data?: QResult): null | keyof QResult {
  if (!data) {
    return null;
  }
  const connectionFields = Object.keys(data);
  if (connectionFields && connectionFields.length === 0) {
    return null;
  }
  if (connectionFields && connectionFields.length !== 1) {
    throw new Error(
      `query must have single selection set, but found many: ${connectionFields.join(
        ', ',
      )}`,
    );
  }
  return connectionFields[0] as any;
}

export function useChunkedQuery<QResult, QVars extends { page?: Maybe<Page> }>(
  query: DocumentNode,
  options: QueryHookOptions<QResult, QVars> = {},
  limit = 40,
): Omit<QueryResult<QResult, QVars>, 'fetchMore'> {
  const { data, fetchMore, ...rest } = useQuery<QResult, QVars>(query, {
    ...options,
    variables: { ...options.variables, page: { limit } } as any,
  });
  // We assume that limit and variables do not change during query's existence
  const immutableParamsRef = useRef({ limit, variables: options.variables });

  const connectionField = getConnectionField(data);
  const loaded = connectionField
    ? (data?.[connectionField] as any).nodes.length
    : -1;
  const total = connectionField ? (data?.[connectionField] as any).count : -1;

  useEffect(() => {
    if (loaded < total) {
      fetchMore({
        query,
        variables: {
          ...immutableParamsRef.current.variables,
          page: { limit: immutableParamsRef.current.limit, offset: loaded },
        },
      }).catch(() => {
        // ignore network errors
      });
    }
  }, [query, fetchMore, loaded, total, connectionField, immutableParamsRef]);

  return { data, ...rest };
}
