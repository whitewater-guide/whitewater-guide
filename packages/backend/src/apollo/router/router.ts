import { graphiqlKoa, graphqlKoa } from 'apollo-server-koa';
import { graphql, introspectionQuery } from 'graphql';
import Router from 'koa-router';
import { newContext } from '../context';
import { formatError } from '../formatError';
import { getSchema, getTypeDefs } from './schema';

export const graphqlRouter = new Router();

graphqlRouter.post('/graphql', graphqlKoa(async (ctx) => {
  // Get user's device screen size in pixels, defaults to 1080x1920
  const schema = await getSchema();
  return {
    schema,
    debug: process.env.NODE_ENV !== 'production',
    context: newContext(ctx),
    formatError,
  };
}));

if (process.env.APOLLO_EXPOSE_GRAPHIQL === 'true') {
  graphqlRouter.get(
    '/graphiql',
    graphiqlKoa({ endpointURL: '/graphql' }) as any,
  );
}

if (process.env.APOLLO_EXPOSE_SCHEMA === 'true') {
  graphqlRouter.get(
    '/schema.json',
    async (ctx) => {
      const schema = await getSchema();
      await graphql(schema, introspectionQuery).then(result => ctx.body = result);
    },
  );
  graphqlRouter.get(
    '/typedefs.txt',
    async (ctx) => {
      ctx.body = await getTypeDefs();
    },
  );
}
