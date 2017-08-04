import { formatError as apolloFormatError } from 'apollo-errors';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import { Router } from 'express';
import { GraphQLError } from 'graphql';
import { UnknownError } from './enhancedResolvers';
import { schema } from './schema';

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
  graphqlExpress( (req) => ({
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
