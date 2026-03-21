import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This fixes bug #460, where updating section causes demo field to reset
 */
export async function up(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '033/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '032/upsert_section.sql'));
}
