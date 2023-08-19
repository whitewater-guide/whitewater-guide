import { getValidationErrors } from '@whitewater-guide/clients';
import { ApolloErrorCodes } from '@whitewater-guide/commons';
import { GraphQLError } from 'graphql';

export default function getFormErrors(errors: ReadonlyArray<GraphQLError>) {
  if (errors.length === 0) {
    return {};
  }
  const { id, code } = errors[0].extensions ?? {};
  switch (code) {
    case ApolloErrorCodes.FORBIDDEN:
      return { form: errors[0].message };
    case ApolloErrorCodes.BAD_USER_INPUT:
      return getValidationErrors([...errors]);
    default:
      return { form: `${code} error has occured (${id})` };
  }
}
