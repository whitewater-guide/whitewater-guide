/* eslint-disable node/no-process-env */
import type { Knex } from 'knex';

import FsMigrationSource from './FsMigrationSource';

const production = (): Knex.Config => ({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    keepAlive: true,
  },
  migrations: {
    tableName: 'migrations',
    migrationSource: new FsMigrationSource('./dist/migrations'),
  },
  pool: {
    min: 0,
  },
  // debug: true,
});

export default production;
