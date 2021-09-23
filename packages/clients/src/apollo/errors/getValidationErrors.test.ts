import { ApolloError } from '@apollo/client';
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

it('should work for ApolloError from new version of apollo server', () => {
  const e = new ApolloError({
    graphQLErrors: [
      new GraphQLError(
        'invalid input',
        undefined,
        undefined,
        undefined,
        ['upsertRegion'],
        undefined,
        {
          validationErrors: {
            region: {
              name: 'yup:string.nonEmpty',
              bounds: 'region.bounds field must have at least 3 items',
            },
          },
          args: {
            region: {
              id: null,
              name: '',
              description: null,
              season: null,
              seasonNumeric: [],
              pois: [],
              bounds: [],
              license: null,
              copyright: null,
            },
          },
          code: 'BAD_USER_INPUT',
          exception: {},
          id: 'YAH54Das30',
        },
      ),
    ],
    clientErrors: [],
    networkError: null,
    errorMessage: 'invalid input',
  });

  expect(getValidationErrors(e)).toEqual({
    bounds: 'region.bounds field must have at least 3 items',
    name: 'yup:string.nonEmpty',
  });
});
