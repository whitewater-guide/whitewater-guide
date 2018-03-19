import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';
import log from '../../log/index';
import { resolvers } from './resolvers';

const logger = log.child({ module: 'apollo' });

let typeDefs: string;
let schema: GraphQLSchema;

async function loadSchema() {
  const typesArray = fileLoader(join(process.cwd(), 'src'), { recursive: true, extensions: ['.graphql'] });
  typeDefs = mergeTypes(typesArray);
  schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
  });
  logger.info('Initialized GRAPHQL schema');
  return schema;
}

export async function getSchema(): Promise<GraphQLSchema> {
  if (schema) {
    return Promise.resolve(schema);
  }
  return loadSchema();
}

export async function getTypeDefs(): Promise<string> {
  if (typeDefs) {
    return Promise.resolve(typeDefs);
  }
  await loadSchema();
  return typeDefs;
}
