declare module 'graphql-fields' {
  import type { GraphQLResolveInfo } from 'graphql';

  interface Result {
    [field: string]: Result;
  }

  function graphqlFields(info: GraphQLResolveInfo): Result;

  export = graphqlFields;
}
