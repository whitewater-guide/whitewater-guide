import { makeExecutableSchema } from 'apollo-server-koa';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';

import { AdminDirective } from '../directives';
import { logger } from '../logger';
import { resolvers } from './resolvers';

let typeDefs: string;
let schema: GraphQLSchema;

async function loadSchema() {
  const typesArray = fileLoader(
    join(process.cwd(), process.env.NODE_ENV === 'production' ? 'dist' : 'src'),
    {
      recursive: true,
      extensions: ['.graphql'],
    },
  );
  // it seems that definitions are incorrect and it still returns string
  typeDefs = mergeTypes(typesArray) as any;
  const result = makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
    schemaDirectives: {
      admin: AdminDirective as any,
    },
  });
  logger.info('Initialized GRAPHQL schema');
  return result;
}

export async function getSchema(): Promise<GraphQLSchema> {
  if (!schema) {
    schema = await loadSchema();
  }
  return schema;
}

export async function getTypeDefs(): Promise<string> {
  if (typeDefs) {
    return Promise.resolve(typeDefs);
  }
  await loadSchema();
  return typeDefs;
}
