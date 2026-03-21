import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This migration adds "importId" to upsert_river and upsert_section
 */
export async function up(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '032/upsert_river.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '032/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '001/upsert_river.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '029/upsert_section.sql'));
}
