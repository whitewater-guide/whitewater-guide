import * as fs from 'fs';
import Knex = require('knex');

export async function runSqlFile(db: Knex, path: string) {
  const upsertRegion = await fs.readFileSync(path).toString();
  await db.schema.raw(upsertRegion);
}
