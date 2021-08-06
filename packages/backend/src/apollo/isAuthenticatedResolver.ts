import { AuthenticationError } from 'apollo-server-koa';
import { GraphQLFieldResolver } from 'graphql';
import { Required } from 'utility-types';

import { Context } from './context';
import {
  MutationResolvers,
  QueryResolvers,
  Resolver,
} from './resolvers.generated';

export const isAuthenticatedResolver =
  <TSource, Vars>(
    resolver: GraphQLFieldResolver<TSource, Context, Vars>,
  ): GraphQLFieldResolver<TSource, Required<Context, 'user'>, Vars> =>
  (source, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('must authenticate');
    }
    return resolver(source, args, context, info);
  };

type AuthenticatedResolver<T> = T extends Resolver<
  infer TParent,
  infer TVars,
  Context,
  infer TInfo
>
  ? Resolver<TParent, TVars, Required<Context, 'user'>, TInfo>
  : never;

// Helper to use with isAuthenticatedResolver
// ensures that context user is defined
export type AuthenticatedQuery = {
  [Q in keyof QueryResolvers]: AuthenticatedResolver<QueryResolvers[Q]>;
};

// Helper to use with isAuthenticatedResolver
// ensures that context user is defined
export type AuthenticatedMutation = {
  [Q in keyof MutationResolvers]: AuthenticatedResolver<MutationResolvers[Q]>;
};
