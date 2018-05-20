import Knex from 'knex';

export async function dropViews(db: Knex, ...views: string[]) {
  for (const view of views) {
    await db.raw(`DROP VIEW IF EXISTS ${view}_view`);
  }
}
