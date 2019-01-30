import { createConnectors } from '@db/connectors';
import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';
import { newContext } from '../context';
import { formatError } from '../formatError';
import { logger } from '../logger';
import { graphqlRouter } from './router';
import { getSchema } from './schema';

export const createApolloServer = async (app: Koa) => {
  const schema = await getSchema();
  const server = new ApolloServer({
    schema,
    context: newContext,
    dataSources: createConnectors,
    formatError,
    debug: process.env.NODE_ENV === 'development',
  });

  server.applyMiddleware({
    app,
    bodyParserConfig: false,
    cors: false,
  });

  app.use(graphqlRouter.routes());
  logger.info('Initialized apollo-server-koa');
};
