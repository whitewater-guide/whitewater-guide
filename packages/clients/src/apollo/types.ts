import { Connection } from '@whitewater-guide/commons';
import { ApolloError, ApolloQueryResult, NetworkStatus } from 'apollo-client';

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
  networkStatus: NetworkStatus;
  refetch: () => Promise<ApolloQueryResult<Connection<T>>>;
  error?: ApolloError;
}
