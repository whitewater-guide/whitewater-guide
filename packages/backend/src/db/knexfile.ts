import knex from 'knex';
import * as production from './knex.production';
import * as development from './knex.development';
import * as test from './knex.testing';

const configs: { [env: string]: knex.Config } = {
  production,
  development,
  test,
};

export default configs;
