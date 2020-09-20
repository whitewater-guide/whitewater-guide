/* eslint-disable node/no-process-env */
import knex from 'knex';

const test: knex.Config = {
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
    loadExtensions: ['.ts'],
    tableName: 'migrations',
    directory: './src/migrations',
  } as any,
  seeds: {
    loadExtensions: ['.ts'],
    directory: './src/seeds/test',
  } as any,
  debug: false,
};

module.exports = test;
