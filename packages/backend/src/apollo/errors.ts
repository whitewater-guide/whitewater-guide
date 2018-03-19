import { createError } from 'apollo-errors';

export const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred!  Please try again later',
});

export const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this',
});

export const ForbiddenError = createError('ForbiddenError', {
  message: 'You are not allowed to do this',
});

export const ValidationError = createError('ValidationError', {
  message: 'Invalid input',
});

export const MutationNotAllowedError = createError('MutationNotAllowedError', {
  message: 'Mutation not allowed',
});
