/* eslint-disable import/namespace */
import knex from 'knex';

import * as development from './knex.development';
import * as production from './knex.production';
import * as test from './knex.testing';

const configs: { [env: string]: knex.Config } = {
  production,
  development,
  test,
};

export default configs;
