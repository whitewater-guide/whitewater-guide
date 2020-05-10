import Knex from 'knex';
import { runSqlFile } from '@db';

/**
 * This fixes bug #460, where updating section causes demo field to reset
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/033/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/032/upsert_section.sql');
};

export const configuration = { transaction: true };
