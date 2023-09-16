import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This migration add psql function to delete sections
 * This allows to transactionally delete river when its last section is deleted
 */
export async function up(db: Knex): Promise<void> {
  await runSqlFile(db, resolveRelative(__dirname, '034/remove_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS remove_section(section_id UUID) CASCADE',
  );
}
