/* eslint-disable node/no-process-env */
import Knex from 'knex';

import knexConfig from './knexfile';

const env = process.env.NODE_ENV || 'development';
const config: Knex.Config = knexConfig[env];

export const knex = Knex(config);

let testTransaction: Knex.Transaction | null = null;

export function db(getKnexInstance = false): Knex<any, any> {
  if (env === 'test' && !getKnexInstance) {
    if (testTransaction) {
      return testTransaction;
    }
    throw new Error('No saved test transaction found');
  }
  return knex;
}

// See here https://github.com/tgriesser/knex/issues/2076
// And here https://gist.github.com/odigity/7f37077de74964051d45c4ca80ec3250
export const holdTransaction = () => {
  if (env !== 'test') {
    throw new Error('holdTransaction is only available in test mode');
  }
  const tmp: any = {};
  const p = new Promise((resolve) => {
    tmp.resolve = resolve;
  });
  knex
    .transaction((tx) => {
      testTransaction = tx;
      tmp.resolve();
    })
    .catch(() => {
      // ignore
    });
  return p;
};

export const rollbackTransaction = async () => {
  if (env !== 'test') {
    throw new Error('rollbackTransaction is only available in test mode');
  }
  if (testTransaction) {
    await testTransaction.rollback();
    testTransaction = null;
  }
};
