import { ApolloCache } from 'apollo-cache';

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

export type ListType =
  | 'gauges'
  | 'regions'
  | 'rivers'
  | 'sections'
  | 'sources'
  | 'users'
  | 'mediaBySection'
  | 'groups'
  | 'suggestions'
  | 'banners'
  | 'history'
  | 'suggestions';
