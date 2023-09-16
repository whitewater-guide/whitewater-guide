/* eslint-disable node/no-process-env */
import type { Knex } from 'knex';

import FsMigrationSource from './FsMigrationSource';

const development = (): Knex.Config => ({
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
    migrationSource: new FsMigrationSource('./src/migrations'),
    tableName: 'migrations',
  },
  seeds: {
    loadExtensions: ['.ts'],
    directory: './src/seeds/development',
  },
  debug: false,
});

export default development;
