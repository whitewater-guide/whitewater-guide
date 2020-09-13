import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This patch adds ability to upsert section together with media
 * Also upsert_section_media now supports JSON arrays
 */
export const up = async (db: Knex) => {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(db, path.resolve(__dirname, '025/upsert_section_media.sql'));
  await runSqlFile(db, path.resolve(__dirname, '025/upsert_section.sql'));
};

export const down = async (db: Knex) => {
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await runSqlFile(db, path.resolve(__dirname, '008/upsert_section_media.sql'));
  await runSqlFile(db, path.resolve(__dirname, '003/upsert_section.sql'));
};

export const configuration = { transaction: true };
