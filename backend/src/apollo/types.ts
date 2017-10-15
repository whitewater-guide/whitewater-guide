import { GraphQLFieldResolver } from 'graphql';
import { UserRaw } from '../features/users/types';

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
};

export interface Context {
  user?: UserRaw;
}

export interface QueryWithLanguage {
  language?: string;
}

export interface NodeQuery extends QueryWithLanguage {
  id: string;
}
