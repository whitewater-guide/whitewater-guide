/* eslint-disable node/no-process-env */
import knex from 'knex';

import { FsDevMigrations } from './FsDevMigrations';

const development: knex.Config = {
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
    migrationSource: new FsDevMigrations('./src/migrations', false, ['.ts']),
    tableName: 'migrations',
  },
  seeds: {
    loadExtensions: ['.ts'],
    directory: './src/seeds/development',
  },
  debug: false,
} as any;

module.exports = development;
