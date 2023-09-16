import type { Knex } from 'knex';

import development from './knex.development';
import production from './knex.production';
import test from './knex.testing';

// Uses factory functions because knex will modify connection object to hide password
// and wee need this to wait for db to start
const configs: { [env: string]: () => Knex.Config } = {
  production,
  development,
  test,
};

export default configs;
