import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from '@whitewater-guide/schema';

import { addAdminDirective } from '../directives';
import { resolvers } from './resolvers';

export const schema = addAdminDirective(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
);
