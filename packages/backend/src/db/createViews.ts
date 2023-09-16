import { readFileSync } from 'fs';
import type { Knex } from 'knex';

import { resolveRelative } from '../utils/index';

export async function createView(db: Knex, view: string, version = 1) {
  for (let i = version; i >= 1; i -= 1) {
    const file = resolveRelative(
      __dirname,
      '../migrations',
      `${i.toString(10).padStart(3, '0')}/${view}_view.sql`,
    );
    let sql: string;
    try {
      sql = readFileSync(file).toString();
    } catch (e) {
      continue;
    }
    // should be created sequentially
    // eslint-disable-next-line no-await-in-loop
    await db.schema.raw(sql);
    return;
  }
  throw new Error(
    `No sql files for view '${view}' of version ${version} or lower found`,
  );
}

// Views will be created in reverse order
export async function createViews(
  db: Knex,
  version: number,
  ...views: string[]
) {
  const inverted = [...views].reverse();
  for (const view of inverted) {
    await createView(db, view, version);
  }
}
