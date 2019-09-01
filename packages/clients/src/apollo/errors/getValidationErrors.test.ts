import { ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';
import { getValidationErrors } from './getValidationErrors';

it('should work for ApolloError', () => {
  const error = new ApolloError({
    graphQLErrors: [
      {
        message: 'invalid input',
        locations: [
          {
            line: 2,
            column: 3,
          },
        ],
        path: ['upsertRiver'],
        extensions: {
          code: 'BAD_USER_INPUT',
          exception: {
            validationErrors: {
              river: {
                name: 'Value must be non-empty string',
              },
            },
          },
          id: 'ha1wQZBVXa',
        },
      },
    ],
    networkError: null,
    message: 'GraphQL error: invalid input',
  } as any);
  expect(getValidationErrors(error)).toEqual({
    name: 'Value must be non-empty string',
  });
});

it('should work for array of GraphqlErrors', () => {
  const e1 = new GraphQLError(
    'invalid input',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      code: 'BAD_USER_INPUT',
      exception: {
        validationErrors: {
          river: {
            name: 'Value must be non-empty string',
          },
        },
      },
      id: 'ha1wQZBVXa',
    },
  );
  const e2 = new GraphQLError(
    'invalid input',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    {
      code: 'BAD_USER_INPUT',
      exception: {
        validationErrors: {
          river: {
            difficulty: 'yup:errors.number.min',
          },
        },
      },
      id: '1a1wQZBVXa',
    },
  );
  expect(getValidationErrors([e1, e2])).toEqual({
    name: 'Value must be non-empty string',
    difficulty: 'yup:errors.number.min',
  });
});
