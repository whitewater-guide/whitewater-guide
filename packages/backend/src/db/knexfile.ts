import * as knex from 'knex';
import * as development from './knex.development';
import * as test from './knex.test';

const configs: { [env: string]: knex.Config } = {
  development,
  test,
};

export default configs;
