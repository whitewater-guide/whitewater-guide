/* eslint-disable max-classes-per-file */
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { ApolloError } from 'apollo-server-koa';

export class UnknownError extends ApolloError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, ApolloErrorCodes.UNKNOWN_ERROR, properties);

    Object.defineProperty(this, 'name', { value: 'UnknownError' });
  }
}

export class MutationNotAllowedError extends ApolloError {
  constructor(
    message = 'mutation not allowed',
    properties?: Record<string, any>,
  ) {
    super(message, ApolloErrorCodes.MUTATION_NOT_ALLOWED, properties);

    Object.defineProperty(this, 'name', { value: 'MutationNotAllowedError' });
  }
}
