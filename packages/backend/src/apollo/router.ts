import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import { graphql, introspectionQuery } from 'graphql';
import { formatError } from './formatError';
import { getSchema, getTypeDefs } from './schema';

export const graphqlRouter = Router();

graphqlRouter.use(
  '/graphql',
  graphqlExpress(async (req) => {
    const schema = await getSchema();
    return {
      schema,
      debug: process.env.NODE_ENV !== 'production',
      context: { user: req!.user },
      formatError,
    };
  }),
);

if (process.env.NODE_ENV !== 'production') {
  graphqlRouter.use(
    '/graphiql',
    graphiqlExpress({ endpointURL: '/graphql' }),
  );
}

if (process.env.NODE_ENV !== 'production') {
  graphqlRouter.use('/schema.json', async (req, res) => {
    const schema = await getSchema();
    const result = await graphql(schema, introspectionQuery);
    res.json(result);
  });
  graphqlRouter.use('/typedefs.txt', async (req, res) => {
    const typeDefs = await getTypeDefs();
    res.send(typeDefs);
  });
}