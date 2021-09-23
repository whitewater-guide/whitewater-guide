import { ApolloError } from '@apollo/client';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GraphQLError } from 'graphql';
import merge from 'lodash/merge';

export function getValidationErrors(
  e: ApolloError | GraphQLError[],
): Record<string, any> {
  const errors = Array.isArray(e) ? e : e.graphQLErrors || [];
  if (errors.length === 0) {
    return {};
  }
  let validationErrors: Record<string, any> = {};
  errors.forEach((ge) => {
    if (
      ge.extensions &&
      ge.extensions.code === ApolloErrorCodes.BAD_USER_INPUT
    ) {
      // https://www.apollographql.com/docs/apollo-server/migration/#reading-error-extensions
      // Support errors from apollo-server v2 and v3
      const ve =
        ge.extensions.validationErrors ??
        ge.extensions.exception.validationErrors;
      validationErrors = merge({}, validationErrors, ve);
    }
  });

  // Usually validation errors contain only one top-level key (form mutations have only one argument)
  const nested = Object.values(validationErrors);

  return nested[0] || {};
}
