import Knex from 'knex';

export async function rawUpsert<T>(db: Knex, query: string, bindings?: any): Promise<T> {
  const key: string = (query.split('SELECT ')[1]).split('(')[0];
  const result = await db.raw(query, bindings);
  return result.rows[0][key];
}
