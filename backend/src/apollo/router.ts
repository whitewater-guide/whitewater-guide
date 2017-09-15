import { formatError as apolloFormatError } from 'apollo-errors';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import { graphql, GraphQLError, introspectionQuery } from 'graphql';
import { UnknownError } from './enhancedResolvers';
import { mergedTypedefs, schema } from './schema';

export const graphqlRouter = Router();

const formatError = (error: any) => {
  let e = apolloFormatError(error);

  if (e instanceof GraphQLError) {
    e = apolloFormatError(new UnknownError({
      data: {
        originalMessage: e.message,
        originalError: e.name,
      },
    }));
  }

  return e;
};

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
