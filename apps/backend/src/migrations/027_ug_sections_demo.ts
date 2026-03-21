import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This patch allows to set demo on upsert (when section is approved)
 */
export async function up(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '027/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '025/upsert_section.sql'));
}
