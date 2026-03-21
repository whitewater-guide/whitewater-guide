/* eslint-disable node/no-process-env */
import type { Knex } from 'knex';

import FsMigrationSource from './FsMigrationSource';

const test = (): Knex.Config => ({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: 'wwtest',
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
  },
  pool: {
    min: 0,
    max: 1,
    idleTimeoutMillis: 500,
  },
  migrations: {
    tableName: 'migrations',
    migrationSource: new FsMigrationSource('./src/migrations'),
  },
  seeds: {
    loadExtensions: ['.ts'],
    directory: './src/seeds/test',
  },
  // debug: true,
});

export default test;
