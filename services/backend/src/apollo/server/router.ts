import { getIntrospectionQuery, graphql } from 'graphql';
import { getSchema, getTypeDefs } from './schema';

import Router from 'koa-router';

export const graphqlRouter = new Router({ prefix: '/graphql' });

if (process.env.APOLLO_EXPOSE_SCHEMA === 'true') {
  graphqlRouter.get('/schema.json', async (ctx) => {
    const schema = await getSchema();
    await graphql(schema, getIntrospectionQuery()).then(
      (result) => (ctx.body = result),
    );
  });
  graphqlRouter.get('/typedefs.txt', async (ctx) => {
    ctx.body = await getTypeDefs();
  });
}
