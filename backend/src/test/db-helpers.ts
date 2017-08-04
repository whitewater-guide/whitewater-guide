import { graphql } from 'graphql';
import { schema } from '../apollo';
import db from '../db';
import omit = require('lodash/omit');

export const reseedDb = async () => {
  await db(true).migrate.rollback();
  await db(true).migrate.latest();
  await db(true).seed.run();
};

export const rollbackDb = async () => {
  await db(true).migrate.rollback();
};

export const runQuery = async (query: string, variables?: { [p: string]: any }, context?: any ) => {
  return graphql(schema, query, undefined, context, variables);
};

export const disconnect = async () => {
  await db(true).destroy();
};

export const noTimestamps = (row: any) => omit(row, ['createdAt', 'updatedAt', 'created_at', 'updated_at']);

export const noUnstable = (row: any) => omit(row, ['id', 'createdAt', 'updatedAt', 'created_at', 'updated_at']);

export const isUUID = (s: string) =>
  (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(s);

export const isTimestamp = (s: string) =>
  (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/).test(s);

export const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
