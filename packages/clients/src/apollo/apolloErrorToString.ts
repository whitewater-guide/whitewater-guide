import { ApolloError } from 'apollo-client';

export const apolloErrorToString = (e: ApolloError): string => {
  return `${e.message}\n\n${JSON.stringify(e, null, 2)}`;
};
