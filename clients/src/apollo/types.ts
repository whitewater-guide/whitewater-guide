import { ApolloError, ApolloQueryResult } from 'apollo-client';
import { Connection } from '../../ww-commons';

export interface FetchMoreResult<T, V = any> {
  fetchMoreResult: T;
  queryVariables: V;
}

export interface WithList<T> {
  nodes: T[];
  count: number;
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<Connection<T>>>;
  error?: ApolloError;
}

export interface WithNode<T> {
  node: T;
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<Connection<T>>>;
  error?: ApolloError;
}
