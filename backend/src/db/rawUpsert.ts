import Knex = require('knex');

export async function rawUpsert<T>(db: Knex, query: string, queryName?: string): Promise<T> {
  const key: string = queryName || (query.split('SELECT ')[1]).split('(')[0];
  const result = await db.raw(query);
  return result.rows[0][key][0];
}
