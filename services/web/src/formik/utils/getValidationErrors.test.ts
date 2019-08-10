import { ApolloError } from 'apollo-client';
import { getValidationErrors } from './getValidationErrors';

it('should simply work', () => {
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
