import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-client';
import { FormikErrors } from 'formik';
import merge from 'lodash/merge';

export const getValidationErrors = (e: ApolloError): FormikErrors<any> => {
  if (!e.graphQLErrors) {
    return {};
  }
  let validationErrors: FormikErrors<any> = {};
  e.graphQLErrors.forEach((ge) => {
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
