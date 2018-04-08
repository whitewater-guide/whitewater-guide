import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema, visitSchema } from 'graphql-tools';
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import { join } from 'path';
import log from '../../log/index';
import { AdminDirective } from '../directives';
import { LimitIntrospection } from './IntrospectionVisitor';
import { resolvers } from './resolvers';

const logger = log.child({ module: 'apollo' });

let typeDefs: string;
let schema: GraphQLSchema;
// Defined second schema for graphiql UI, so curious users cannot see mutations and admin fields
let graphiqlSchema: GraphQLSchema;

async function loadSchema() {
  const typesArray = fileLoader(join(process.cwd(), 'src'), { recursive: true, extensions: ['.graphql'] });
  typeDefs = mergeTypes(typesArray);
  schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    allowUndefinedInResolve: false,
    schemaDirectives: {
      admin: AdminDirective,
    },
  });
  logger.info('Initialized GRAPHQL schema');
  return schema;
}

export async function getGraphiqlSchema(): Promise<GraphQLSchema> {
  if (!graphiqlSchema) {
    graphiqlSchema = await loadSchema();
    const visitor = new LimitIntrospection();
    visitSchema(graphiqlSchema, () => [visitor]);
  }
  return graphiqlSchema;
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
