import knex from 'knex';
import * as development from './knex.development';
import * as test from './knex.testing';

const configs: { [env: string]: knex.Config } = {
  development,
  test,
};

export default configs;
