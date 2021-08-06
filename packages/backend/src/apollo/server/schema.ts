import { typeDefs } from '@whitewater-guide/schema';
import { makeExecutableSchema } from 'graphql-tools';

import { AdminDirective } from '../directives';
import { resolvers } from './resolvers';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  allowUndefinedInResolve: false,
  schemaDirectives: {
    admin: AdminDirective,
  },
});
