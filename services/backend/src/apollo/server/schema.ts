import { gql, SchemaDirectiveVisitor } from 'apollo-server';
import { GraphQLSchema } from 'graphql';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';
import { AdminDirective } from '../directives';
import { logger } from '../logger';
import { resolvers } from './resolvers';
import { buildFederatedSchema } from '@apollo/federation';

let typeDefs: string;
let schema: GraphQLSchema;

async function loadSchema() {
  const typesArray = fileLoader(join(process.cwd(), 'dist'), {
    recursive: true,
    extensions: ['.graphql'],
  });
  typeDefs = mergeTypes(typesArray);
  const result = buildFederatedSchema({ typeDefs: gql(typeDefs), resolvers });
  SchemaDirectiveVisitor.visitSchemaDirectives(result, {
    admin: AdminDirective,
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
