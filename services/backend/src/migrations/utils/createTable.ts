import Knex, { CreateTableBuilder } from 'knex';

export const createTable = async (
  db: Knex,
  tableName: string,
  callback: (tableBuilder: CreateTableBuilder) => any,
) => {
  const query = db.schema.createTable(tableName, callback);
  if (process.env.NODE_ENV === 'test') {
    let statement = query.toString();
    statement = statement.replace('create table', 'create unlogged table');
    await db.raw(statement);
  } else {
    await query;
  }
};
