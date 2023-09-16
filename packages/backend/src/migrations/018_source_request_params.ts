import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

const VIEWS = ['sources'];

/**
 * This patch adds cover file size column to media
 */
export async function up(db: Knex): Promise<void> {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add source request params
  await db.schema.table('sources', (table) => {
    table.json('request_params');
  });

  await createViews(db, 18, ...VIEWS);
  await runSqlFile(db, resolveRelative(__dirname, '018/upsert_source.sql'));
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sources', (table) => {
    table.dropColumn('request_params');
  });

  await createViews(db, 17, ...VIEWS);
  await runSqlFile(db, resolveRelative(__dirname, '001/upsert_source.sql'));
}
