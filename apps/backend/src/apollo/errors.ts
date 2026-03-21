/* eslint-disable max-classes-per-file */
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GraphQLError } from 'graphql';

export class UnknownError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: { code: ApolloErrorCodes.UNKNOWN_ERROR, ...properties },
    });
  }
}

export class MutationNotAllowedError extends GraphQLError {
  constructor(
    message = 'mutation not allowed',
    properties?: Record<string, any>,
  ) {
    super(message, {
      extensions: {
        code: ApolloErrorCodes.MUTATION_NOT_ALLOWED,
        ...properties,
      },
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: {
        code: ApolloErrorCodes.UNAUTHENTICATED,
        ...properties,
      },
    });
  }
}

export class ForbiddenError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: {
        code: ApolloErrorCodes.FORBIDDEN,
        ...properties,
      },
    });
  }
}

export class UserInputError extends GraphQLError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, {
      extensions: {
        code: ApolloErrorCodes.BAD_USER_INPUT,
        ...properties,
      },
    });
  }
}
