import Knex from 'knex';
import { runSqlFile } from '@db';

/**
 * This migration adds logbooks
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/034/logbook.sql');
};

export const down = async (db: Knex) => {
  await db.schema.dropTableIfExists('logbook_descents');
  await db.schema.dropTableIfExists('logbook_sections');
};

export const configuration = { transaction: true };
