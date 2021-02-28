import { Page } from '@whitewater-guide/commons';
import { GraphQLFieldResolver } from 'graphql';
import { Required } from 'utility-types';

import { Context } from './context';

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
} & { __resolveType?: GraphQLFieldResolver<TRaw, Context> };

export interface ListQuery {
  page?: Page;
}

export interface NodeQuery {
  id?: string;
}

export interface WithLanguage {
  language: string;
}

export type TopLevelResolver<Vars = unknown> = GraphQLFieldResolver<
  any,
  Context,
  Vars
>;

export type AuthenticatedTopLevelResolver<
  Vars = unknown
> = GraphQLFieldResolver<any, Required<Context, 'user'>, Vars>;
