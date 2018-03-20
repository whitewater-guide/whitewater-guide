import fs from 'fs';
import Knex from 'knex';

export async function runSqlFile(db: Knex, path: string) {
  const upsertRegion = await fs.readFileSync(path).toString();
  await db.schema.raw(upsertRegion);
}
