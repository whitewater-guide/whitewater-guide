import { readFileSync } from 'fs';
import Knex from 'knex';

// tslint:disable-next-line:no-inferrable-types
export async function createView(db: Knex, view: string, version: number = 1) {
  for (let i = version; i >= 1; i--) {
    const file = `./dist/migrations/${i
      .toString(10)
      .padStart(3, '0')}/${view}_view.sql`;
    let sql: string;
    try {
      sql = readFileSync(file).toString();
    } catch (e) {
      continue;
    }
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