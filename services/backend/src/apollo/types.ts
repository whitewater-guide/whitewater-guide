import { Page } from '@whitewater-guide/commons';
import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { Context } from './context';

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
} & {
  __resolveType?: GraphQLFieldResolver<TRaw, Context>;
  __resolveReference?: (
    data: Partial<TRaw>,
    ctx: Context,
    info: GraphQLResolveInfo,
  ) => any;
};

export interface ListQuery {
  page?: Page;
}

export interface NodeQuery {
  id?: string;
}

export interface WithLanguage {
  language: string;
}

export type TopLevelResolver<Vars = {}> = GraphQLFieldResolver<
  any,
  Context,
  Vars
>;
