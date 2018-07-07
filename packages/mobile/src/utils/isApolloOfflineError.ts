import { ApolloError } from 'apollo-client';

const isApolloOfflineError = (error: ApolloError, data?: any) =>
  error &&
  error.networkError &&
  error.networkError.message === 'Network request failed' &&
  (!data || Array.isArray(data) && data.length === 0);

export default isApolloOfflineError;
