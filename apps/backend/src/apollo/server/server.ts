import type http from 'node:http';

import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';
import type Koa from 'koa';
import Router from 'koa-router';

import config from '../../config';
import { koaContext } from '../context';
import { formatError } from '../formatError';
import { logger } from '../logger';
import { FieldsByTypePlugin } from '../plugins/index';
import { schema } from './schema';

export async function createApolloServer(
  app: Koa,
  httpServer?: http.Server,
): Promise<void> {
  const server = new ApolloServer({
    schema,
    formatError,
    includeStacktraceInErrorResponses: config.NODE_ENV === 'development',
    plugins: [
      ...(httpServer
        ? [ApolloServerPluginDrainHttpServer({ httpServer })]
        : []),
      new FieldsByTypePlugin(schema),
      //     ApolloServerPluginLandingPageGraphQLPlayground(playground),
    ],
  });
  await server.start();

  const router = new Router();
  const graphqlMiddleware = koaMiddleware(server as any, {
    context: koaContext,
  });
  router.post('/graphql', graphqlMiddleware as any);
  app.use(router.routes());

  logger.info('Initialized apollo-server-koa');
}

export function createTestServer() {
  return new ApolloServer({
    schema,
    formatError,
    introspection: false,
    includeStacktraceInErrorResponses: true,
    plugins: [new FieldsByTypePlugin(schema)],
  });
}
