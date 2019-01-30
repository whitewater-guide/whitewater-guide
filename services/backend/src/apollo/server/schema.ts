import {
  addSchemaLevelResolveFunction,
  makeExecutableSchema,
} from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';
import { AdminDirective } from '../directives';
import { fieldsByType } from '../fieldsByType';
import { logger } from '../logger';
import { resolvers } from './resolvers';

let typeDefs: string;
let schema: GraphQLSchema;

async function loadSchema() {
  const typesArray = fileLoader(join(process.cwd(), 'dist'), {
    recursive: true,
    extensions: ['.graphql'],
  });
  typeDefs = mergeTypes(typesArray);
  const result = makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
    schemaDirectives: {
      admin: AdminDirective,
    },
  });
  addSchemaLevelResolveFunction(result, (source, args, context, info) => {
    fieldsByType(info, context.fieldsByType);
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
