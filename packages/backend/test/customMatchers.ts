import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils';
import get from 'lodash/get';
import has from 'lodash/has';

const isValidationError = (error: any) =>
  has(error, 'extensions.validationErrors');

const hasGraphlError = (
  received: any,
  code?: string,
  message?: string,
): boolean => {
  const hasError =
    received.errors &&
    received.errors.length === 1 &&
    get(received, 'errors.0.extensions.code') === code &&
    (message === undefined || get(received, 'errors.0.message') === message);
  const hasNoData =
    !received.data ||
    Object.values(received.data).every((v: any) => v === null);
  return hasError && hasNoData;
};

const hasGraphqlValidationError = (received: any): boolean =>
  hasGraphlError(received, ApolloErrorCodes.BAD_USER_INPUT) &&
  isValidationError(received.errors[0]);

interface FormatOpts {
  pass: boolean;
  hint: string;
  name?: string;
  received: any;
  code?: string;
  message?: string;
}

const formatGraphqlError = (opts: FormatOpts) => {
  const { pass, hint, name = 'GRAPHQL', received, code, message } = opts;
  const expectedCode = code ? `\n\tcode: ${printExpected(code)}` : '';
  const expectedMessage = message
    ? `\n\tmessage: ${printExpected(message)}`
    : '';
  const pre = expectedCode || expectedMessage ? ' with' : '';
  if (pass) {
    return {
      message: () =>
        `${matcherHint(`.not.${hint}`)}

Expected value not to have ${name} error${pre}${expectedCode}${expectedMessage}
Received:
  value: ${printReceived(received)}
          `,
      pass: true,
    };
  }
  return {
    message: () =>
      `${matcherHint(`.${hint}`)}

Expected value to have ${name} error${pre}${expectedCode}${expectedMessage}
Received:
  value: ${printReceived(received)}
          `,
    pass: false,
  };
};

const customMatchers: jest.ExpectExtendMap = {
  toHaveGraphqlError: (received: any, code?: string, message?: string) => {
    // TODO: add global test that throws that thrown error has id and doesn't have stacktrace
    const pass = hasGraphlError(received, code);
    return formatGraphqlError({
      pass,
      hint: 'toHaveGraphqlError',
      received,
      code,
      message,
    });
  },
  toHaveGraphqlValidationError: (received: any, message?: string) => {
    const pass = hasGraphqlValidationError(received);
    return formatGraphqlError({
      pass,
      name: 'GRAPHQL validation',
      hint: 'toHaveGraphqlValidationError',
      received,
      code: ApolloErrorCodes.BAD_USER_INPUT,
      message,
    });
  },
};

export default customMatchers;
