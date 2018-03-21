import { ExecutionResult, graphql } from 'graphql';
import { isEmpty } from 'lodash';
import { formatError } from '../apollo';
import { getSchema } from '../apollo/router';

export const runQuery = async (query: string, variables?: any, context?: any): Promise<ExecutionResult> => {
  const schema = await getSchema();
  const { errors, ...result } = await graphql(schema, query, undefined, context, variables);
  const errs = (errors && isEmpty(errors)) ? undefined : errors;
  if (errs) {
    return {
      ...result,
      errors: errs.map(formatError),
    };
  }
  return result;
};
