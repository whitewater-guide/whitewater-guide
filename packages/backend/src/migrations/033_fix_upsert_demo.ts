import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This fixes bug #460, where updating section causes demo field to reset
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '033/upsert_section.sql'));
};

export const down = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '032/upsert_section.sql'));
};

export const configuration = { transaction: true };
