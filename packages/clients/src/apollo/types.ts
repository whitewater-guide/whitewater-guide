import { Connection } from '@whitewater-guide/commons';
import { ApolloCache } from 'apollo-cache';
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

// Apollo-client does not export anything like this atm
export interface LocalContext {
  cache: ApolloCache<any>;
  getCacheKey: (obj: any) => string;
}

export type LocalResolver<Vars = unknown> = (
  rootValue: any,
  vars: Vars,
  context: LocalContext,
  info: any,
) => any;
