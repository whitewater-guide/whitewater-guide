import Knex from 'knex';
import path from 'path';

import { createViews, dropViews, runSqlFile } from '~/db';

const VIEWS = ['sources'];

/**
 * This patch adds cover file size column to media
 */
export const up = async (db: Knex) => {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add source request params
  await db.schema.table('sources', (table) => {
    table.json('request_params');
  });

  await createViews(db, 18, ...VIEWS);
  await runSqlFile(db, path.resolve(__dirname, '018/upsert_source.sql'));
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sources', (table) => {
    table.dropColumn('request_params');
  });

  await createViews(db, 17, ...VIEWS);
  await runSqlFile(db, path.resolve(__dirname, '001/upsert_source.sql'));
};

export const configuration = { transaction: true };
