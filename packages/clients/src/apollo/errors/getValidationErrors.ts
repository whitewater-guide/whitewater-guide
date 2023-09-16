import type { ApolloError } from '@apollo/client';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import type { GraphQLError } from 'graphql';
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
    if (ge.extensions?.code === ApolloErrorCodes.BAD_USER_INPUT) {
      const ve =
        ge.extensions.validationErrors ??
        (ge.extensions.exception as any).validationErrors;
      validationErrors = merge({}, validationErrors, ve);
    }
  });

  // Usually validation errors contain only one top-level key (form mutations have only one argument)
  const nested = Object.values(validationErrors);

  return nested[0] || {};
}
