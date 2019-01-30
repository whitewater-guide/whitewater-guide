import { graphql, introspectionQuery } from 'graphql';
import Router from 'koa-router';
import { getSchema, getTypeDefs } from './schema';

export const graphqlRouter = new Router({ prefix: '/graphql' });

if (process.env.APOLLO_EXPOSE_SCHEMA === 'true') {
  graphqlRouter.get('/schema.json', async (ctx) => {
    const schema = await getSchema();
    await graphql(schema, introspectionQuery).then(
      (result) => (ctx.body = result),
    );
  });
  graphqlRouter.get('/typedefs.txt', async (ctx) => {
    ctx.body = await getTypeDefs();
  });
}
