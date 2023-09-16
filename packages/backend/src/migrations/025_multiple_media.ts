import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This patch adds ability to upsert section together with media
 * Also upsert_section_media now supports JSON arrays
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(
    db,
    resolveRelative(__dirname, '025/upsert_section_media.sql'),
  );
  await runSqlFile(db, resolveRelative(__dirname, '025/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(
    db,
    resolveRelative(__dirname, '008/upsert_section_media.sql'),
  );
  await runSqlFile(db, resolveRelative(__dirname, '003/upsert_section.sql'));
}
