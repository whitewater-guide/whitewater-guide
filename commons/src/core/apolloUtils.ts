export const isQueryResult = (action, operationName) =>
  action.type === 'APOLLO_QUERY_RESULT' && action.operationName === operationName;

export const isMutationResult = (action, operationName) =>
  action.type === 'APOLLO_MUTATION_RESULT' && action.operationName === operationName;
