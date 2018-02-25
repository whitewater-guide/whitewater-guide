import { ExecutionResult, graphql } from 'graphql';
import { isEmpty } from 'lodash';
import { formatError, getSchema } from '../apollo';
import db from '../db';
import omitDeep = require('omit-deep-lodash');

export const reseedDb = async () => {
  await db(true).migrate.rollback();
  await db(true).migrate.latest();
  await db(true).seed.run();
};

export const rollbackDb = async () => {
  await db(true).migrate.rollback();
};

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

export const disconnect = async () => {
  await db(true).destroy();
};

export const noTimestamps = (row: any) => omitDeep(row, ['createdAt', 'updatedAt', 'created_at', 'updated_at']);

export const noUnstable = (row: any) => omitDeep(row, ['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']);

export const isUUID = (s: string) =>
  (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(s);

export const isTimestamp = (s: string) =>
  (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3,6}Z/).test(s);

export const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
