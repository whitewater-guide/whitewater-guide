declare module 'graphql-iso-date' {
  import { GraphQLScalarType } from 'graphql';
  export const GraphQLDateTime: GraphQLScalarType;
}

declare module 'graphql-type-json' {
  import { GraphQLScalarType } from 'graphql';
  const GraphQLJSON: GraphQLScalarType;
  export default GraphQLJSON;
}

declare module 'graphql-loader' {
  import { IExecutableSchemaDefinition } from 'graphql-tools/dist/Interfaces';

  interface LoadSchemaOptions {
    typeDefs: string[];
    resolvers: any;
  }
  export function loadSchema(options: LoadSchemaOptions): void;
  export function getSchema(): IExecutableSchemaDefinition;
}

declare module 'http-shutdown' {
  import { Server } from 'http';
  interface Shutdownable {
    shutdown: (callback?: () => void) => void;
  }
  function httpShutdown(server: Server): Server & Shutdownable;
  export = httpShutdown;
}

declare module 'pretty-error';

declare module 'apollo-errors' {
  import { Error } from 'tslint/lib/error';

  class ApolloError extends Error {
    serialize(): {[key: string]: any };
  }

  export function isInstance(e: any): boolean;
  export function createError(name: string, data: {[key: string]: any } ):
    { new <T extends ApolloError>(data?: {[key: string]: any }): T };
  export function formatError(e: ApolloError, returnNull?: boolean): any;
}

declare module 'apollo-resolvers' {
  import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';

  type ErrorHandler<TSource, TContext> = (
    source: TSource,
    args: { [argName: string]: any },
    context: TContext,
    info: GraphQLResolveInfo,
    error: any,
  ) => any;

  type ResolverCreator<TSource, TContext> = (
    resolver: GraphQLFieldResolver<TSource, TContext>,
    errorHandler?: ErrorHandler<TSource, TContext>,
  ) => BaseResolver<TSource, TContext>;

  interface BaseResolver<TSource, TContext> extends GraphQLFieldResolver<TSource, TContext> {
    createResolver: ResolverCreator<TSource, TContext>;
  }

  export function createResolver<TSource, TContext>(
    resolver: GraphQLFieldResolver<TSource, TContext> | null,
    errorHandler: ErrorHandler<TSource, TContext> | null,
  ): BaseResolver<TSource, TContext>;
}

declare module 'cron-parser';
