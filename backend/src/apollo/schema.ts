import { getSchema, loadSchema } from 'graphql-loader';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

loadSchema({ typeDefs, resolvers });

const loadedSchema = getSchema();
export const mergedTypedefs = loadedSchema.typeDefs;

export const schema = makeExecutableSchema({
  ...loadedSchema,
  allowUndefinedInResolve: false,
});
