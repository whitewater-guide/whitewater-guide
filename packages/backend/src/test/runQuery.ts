import { ExecutionResult, graphql } from 'graphql';
import { isEmpty } from 'lodash';
import { formatError } from '../apollo';
import { getSchema } from '../apollo/router';
import { anonContext } from './context';

export const runQuery = async (query: string, variables?: any, context?: any): Promise<ExecutionResult> => {
  const schema = await getSchema();
  const ctx = context || anonContext();
  const { errors, ...result } = await graphql(schema, query, undefined, ctx, variables);
  const errs = (errors && isEmpty(errors)) ? undefined : errors;
  if (errs) {
    return {
      ...result,
      errors: errs.map(formatError),
    };
  }
  return result;
};
