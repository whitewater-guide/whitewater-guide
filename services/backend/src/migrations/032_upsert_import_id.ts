import { runSqlFile } from '~/db';
import Knex from 'knex';

/**
 * This migration adds "importId" to upsert_river and upsert_section
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/032/upsert_river.sql');
  await runSqlFile(db, './dist/migrations/032/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/001/upsert_river.sql');
  await runSqlFile(db, './dist/migrations/029/upsert_section.sql');
};

export const configuration = { transaction: true };
