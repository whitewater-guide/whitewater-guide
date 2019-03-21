import knex from 'knex';

const test: knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST!,
    port: 5432,
    database: process.env.POSTGRES_DB!,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD!,
  },
  pool: {
    min: 0,
    max: 1,
    idleTimeoutMillis: 500,
  },
  migrations: {
    loadExtensions: ['.js'],
    tableName: 'migrations',
    directory: './dist/migrations',
  } as any,
  seeds: {
    loadExtensions: ['.js'],
    directory: './dist/seeds/test',
  } as any,
  debug: false, // process.env.DATABASE_DEBUG === 'true',
};

module.exports = test;
