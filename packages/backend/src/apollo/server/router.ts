import { getIntrospectionQuery, graphql } from 'graphql';
import Router from 'koa-router';

import config from '~/config';

import { getSchema, getTypeDefs } from './schema';

export const graphqlRouter = new Router({ prefix: '/graphql' });

if (config.NODE_ENV !== 'production') {
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
