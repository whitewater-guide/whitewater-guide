import Knex from 'knex';

import { createViews, dropViews, runSqlFile } from '~/db';

const VIEWS = ['sections', 'rivers', 'regions'];

/**
 * This patch adds estimated maps size column
 */
export const up = async (db: Knex) => {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.integer('maps_size').notNullable().defaultTo(0);
  });

  await createViews(db, 20, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.dropColumn('maps_size');
  });

  await createViews(db, 19, ...VIEWS);
};

export const configuration = { transaction: true };
