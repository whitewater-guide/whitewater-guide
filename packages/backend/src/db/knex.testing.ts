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
  migrations: {
    loadExtensions: ['.js'],
    tableName: 'migrations',
    directory: './dist/migrations',
  },
  seeds: {
    loadExtensions: ['.js'],
    directory: './dist/seeds/test',
  },
  debug: false, // process.env.DATABASE_DEBUG === 'true',
} as any;

module.exports = test;
