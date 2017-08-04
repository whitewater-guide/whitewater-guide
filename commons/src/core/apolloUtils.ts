import { ApolloAction } from 'apollo-client/actions';

export const isQueryResult = (action: ApolloAction, operationName: string) =>
  action.type === 'APOLLO_QUERY_RESULT' && action.operationName === operationName;

export const isMutationResult = (action: ApolloAction, operationName: string) =>
  action.type === 'APOLLO_MUTATION_RESULT' && action.operationName === operationName;
