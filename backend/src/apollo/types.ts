import { GraphQLFieldResolver } from 'graphql';
import { UserRaw } from '../features/users/types';

export interface Resource {
  id: string;
}

export interface NamedResource extends Resource {
  name: string;
}

export type FieldResolvers<TRaw, TOut> = {
  [P in keyof TOut]?: GraphQLFieldResolver<TRaw, Context>;
};

export interface Context {
  user?: UserRaw;
}
