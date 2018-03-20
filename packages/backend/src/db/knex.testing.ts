import knex from 'knex';

const test: knex.Config = {
  client: 'pg',
  connection: {
    host: '127.0.0.1', // <------ Tests are run on host machine, not inside docker!
    port: 5432,
    database: 'test',
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD!,
  },
  migrations: {
    loadExtensions: ['.js'],
    tableName: 'migrations',
    directory: './src/migrations',
  },
  seeds: {
    loadExtensions: ['.js'],
    directory: './src/seeds/test',
  },
  debug: false, // process.env.DATABASE_DEBUG === 'true',
} as any;

module.exports = test;
