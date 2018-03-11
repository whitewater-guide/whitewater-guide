import { ApolloError, ApolloQueryResult, NetworkStatus } from 'apollo-client';
import { Connection } from '../../ww-commons';

export interface Page {
  limit?: number;
  offset?: number;
}

export interface WithList<T> {
  nodes: T[];
  count: number;
  loading: boolean;
  networkStatus: NetworkStatus;
  refetch: () => Promise<ApolloQueryResult<Connection<T>>>;
  error?: ApolloError;
  fetchMore: () => Promise<any>;
}

export interface WithNode<T> {
  node: T;
  loading: boolean;
  refetch: () => Promise<ApolloQueryResult<Connection<T>>>;
  error?: ApolloError;
}
