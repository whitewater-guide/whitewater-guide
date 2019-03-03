import { createConnectors } from '@db/connectors';
import { ApolloServer } from 'apollo-server-koa';
import { readJSON } from 'fs-extra';
import * as Koa from 'koa';
import { resolve } from 'path';
import { Omit } from 'type-zoo';
import { Context, newContext } from '../context';
import { formatError } from '../formatError';
import { logger } from '../logger';
import { FieldsByTypePlugin } from '../plugins';
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
    introspection: process.env.NODE_ENV === 'development',
    playground,
    // @ts-ignore
    schemaTag: pJson.version,
    plugins: [new FieldsByTypePlugin(schema)],
  });

  server.applyMiddleware({
    app,
    bodyParserConfig: false,
    cors: false,
  });

  app.use(graphqlRouter.routes());
  logger.info('Initialized apollo-server-koa');
};

export const createTestServer = async (
  context: Omit<Context, 'dataSources'>,
) => {
  const schema = await getSchema();
  return new ApolloServer({
    schema,
    context,
    dataSources: createConnectors,
    formatError,
    debug: false,
    introspection: false,
    playground: false,
    plugins: [new FieldsByTypePlugin(schema)],
  });
};
