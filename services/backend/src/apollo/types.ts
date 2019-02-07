import { Page } from '@whitewater-guide/commons';
import { GraphQLFieldResolver } from 'graphql';
import { Context } from './context';

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>
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
