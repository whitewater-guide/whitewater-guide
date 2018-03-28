import knex from 'knex';

const development: knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST!,
    port: 5432,
    database: process.env.POSTGRES_DB!,
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD!,
    keepAlive: true,
  },
  migrations: {
    loadExtensions: ['.js'],
    tableName: 'migrations',
    directory: './src/migrations',
  },
  seeds: {
    loadExtensions: ['.js'],
    directory: './src/seeds/development',
  },
  debug: process.env.DATABASE_DEBUG === 'true',
} as any;

module.exports = development;
