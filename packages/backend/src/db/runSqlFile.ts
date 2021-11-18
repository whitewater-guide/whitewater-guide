import fs, { readFileSync } from 'fs';
import Knex from 'knex';
import path from 'path';

export async function runSqlFile(db: Knex, path: string) {
  const sql = fs.readFileSync(path).toString();
  await db.schema.raw(sql);
}

export async function runSqlFileVersion(
  db: Knex,
  filename: string,
  version = 1,
) {
  for (let i = version; i >= 1; i -= 1) {
    const file = path.resolve(
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
