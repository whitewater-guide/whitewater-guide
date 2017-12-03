import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import { graphql, introspectionQuery } from 'graphql';
import { formatError } from './formatError';
import { mergedTypedefs, schema } from './schema';

export const graphqlRouter = Router();

graphqlRouter.use(
  '/graphql',
  graphqlExpress((req) => ({
    schema,
    debug: process.env.NODE_ENV !== 'production',
    context: { user: req!.user },
    formatError,
  })),
);

if (process.env.NODE_ENV !== 'production') {
  graphqlRouter.use(
    '/graphiql',
    graphiqlExpress({ endpointURL: '/graphql' }),
  );
}

if (process.env.NODE_ENV !== 'production') {
  graphqlRouter.use('/schema.json', (req, res) => {
    graphql(schema, introspectionQuery).then(result => res.json(result));
  });
  graphqlRouter.use('/typedefs.txt', (req, res) => {
    graphql(schema, introspectionQuery).then(result => res.send(mergedTypedefs));
  });
}
