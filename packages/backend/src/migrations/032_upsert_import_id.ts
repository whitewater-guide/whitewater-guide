import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This migration adds "importId" to upsert_river and upsert_section
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '032/upsert_river.sql'));
  await runSqlFile(db, path.resolve(__dirname, '032/upsert_section.sql'));
};

export const down = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '001/upsert_river.sql'));
  await runSqlFile(db, path.resolve(__dirname, '029/upsert_section.sql'));
};

export const configuration = { transaction: true };
