import { runSqlFile } from '~/db';
import Knex from 'knex';

/**
 * This patch adds ability to upsert section together with media
 * Also upsert_section_media now supports JSON arrays
 */
export const up = async (db: Knex) => {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(db, './dist/migrations/025/upsert_section_media.sql');
  await runSqlFile(db, './dist/migrations/025/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(db, './dist/migrations/008/upsert_section_media.sql');
  await runSqlFile(db, './dist/migrations/003/upsert_section.sql');
};

export const configuration = { transaction: true };
