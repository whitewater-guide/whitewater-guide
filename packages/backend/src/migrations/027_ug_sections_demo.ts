import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This patch allows to set demo on upsert (when section is approved)
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '027/upsert_section.sql'));
};

export const down = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '025/upsert_section.sql'));
};

export const configuration = { transaction: true };
