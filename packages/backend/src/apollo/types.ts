import { GraphQLFieldResolver } from 'graphql';
import { Context } from './context';

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
};

export interface QueryWithLanguage {
  language?: string;
}

export interface Page {
  limit?: number;
  offset?: number;
}

export interface ListQuery extends QueryWithLanguage {
  page?: Page;
}

export interface NodeQuery extends QueryWithLanguage {
  id?: string;
}

export interface RemoveQuery {
  id: string;
}
