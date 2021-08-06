import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';

import config from '~/config';
import { createConnectors } from '~/db/connectors';

import { Context, newContext } from '../context';
import { formatError } from '../formatError';
import { logger } from '../logger';
import { FieldsByTypePlugin } from '../plugins';
import { getPlaygroundConfig } from './playground';
import { schema } from './schema';

export async function createApolloServer(app: Koa) {
  const playground = await getPlaygroundConfig(schema);
  const server = new ApolloServer({
    schema,
    context: newContext,
    dataSources: createConnectors,
    formatError,
    debug: config.NODE_ENV === 'development',
    introspection: config.NODE_ENV === 'development',
    plugins: [
      new FieldsByTypePlugin(schema),
      ApolloServerPluginLandingPageGraphQLPlayground(playground),
    ],
  });

  await server.start();

  server.applyMiddleware({
    app,
    bodyParserConfig: false,
    cors: false,
  });

  logger.info('Initialized apollo-server-koa');
}

export function createTestServer(context: Omit<Context, 'dataSources'>) {
  return new ApolloServer({
    schema,
    context,
    dataSources: createConnectors,
    formatError,
    debug: false,
    introspection: false,
    plugins: [new FieldsByTypePlugin(schema)],
  });
}
