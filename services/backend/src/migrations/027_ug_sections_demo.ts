import { runSqlFile } from '~/db';
import Knex from 'knex';

/**
 * This patch allows to set demo on upsert (when section is approved)
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/027/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/025/upsert_section.sql');
};

export const configuration = { transaction: true };
