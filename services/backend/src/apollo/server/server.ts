import { createConnectors } from '@db/connectors';
import { ApolloServer } from 'apollo-server-koa';
import { readJSON } from 'fs-extra';
import * as Koa from 'koa';
import { resolve } from 'path';
import { newContext } from '../context';
import { formatError } from '../formatError';
import { logger } from '../logger';
import { getPlaygroundConfig } from './playground';
import { graphqlRouter } from './router';
import { getSchema } from './schema';

export const createApolloServer = async (app: Koa) => {
  const pJson = await readJSON(resolve(process.cwd(), 'package.json'));
  const schema = await getSchema();
  const playground = await getPlaygroundConfig(schema);
  const server = new ApolloServer({
    schema,
    context: newContext,
    dataSources: createConnectors,
    formatError,
    debug: process.env.NODE_ENV === 'development',
    introspection: false,
    playground,
    // @ts-ignore
    schemaTag: pJson.version,
  });

  server.applyMiddleware({
    app,
    bodyParserConfig: false,
    cors: false,
  });

  app.use(graphqlRouter.routes());
  logger.info('Initialized apollo-server-koa');
};
