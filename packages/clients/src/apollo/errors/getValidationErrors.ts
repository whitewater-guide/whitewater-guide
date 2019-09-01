import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import { GraphQLError } from 'graphql';
import merge from 'lodash/merge';

export const getValidationErrors = (
  e: ApolloError | GraphQLError[],
): Record<string, any> => {
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
      validationErrors = merge(
        {},
        validationErrors,
        ge.extensions.exception.validationErrors,
      );
    }
  });

  // Usually validation errors contain only one top-level key (form mutations have only one argument)
  const nested = Object.values(validationErrors);

  return (nested[0] || {}) as any;
};
