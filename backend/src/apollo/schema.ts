import { getSchema, loadSchema } from 'graphql-loader';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

loadSchema({ typeDefs, resolvers });

export const schema = makeExecutableSchema({
  ...getSchema(),
  allowUndefinedInResolve: false,
});
