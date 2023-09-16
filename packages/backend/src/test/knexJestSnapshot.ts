import type { Knex } from 'knex';
import { format } from 'pg-formatter';

const constructorNames = [
  'Builder',
  'Raw',
  'SelectQueryBuilder', // TypeORM
  'InsertQueryBuilder', // TypeORM
  'UpdateQueryBuilder', // TypeORM
  'DeleteQueryBuilder', // TypeORM
  'RelationQueryBuilder', // TypeORM
];

module.exports = {
  test: (v: any) => {
    return v?.constructor?.name === 'QueryBuilder_PostgreSQL';
  },
  print: (v: Knex.QueryBuilder) => {
    return format(v.toQuery()).replaceAll('"', '');
  },
};
