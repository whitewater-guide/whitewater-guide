import { readFileSync } from 'node:fs';

import type { Knex } from 'knex';

import { resolveRelative } from '../utils/index';

export async function runSqlFile(db: Knex, path: string) {
  const sql = readFileSync(path).toString();
  await db.schema.raw(sql);
}

export async function runSqlFileVersion(
  db: Knex,
  filename: string,
  version = 1,
) {
  for (let i = version; i >= 1; i -= 1) {
    const file = resolveRelative(
      __dirname,
      '../migrations',
      `${i.toString(10).padStart(3, '0')}/${filename}`,
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
    `No sql files for view '${filename}' of version ${version} or lower found`,
  );
}
