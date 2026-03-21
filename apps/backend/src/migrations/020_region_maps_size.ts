import type { Knex } from 'knex';

import { createViews, dropViews } from '../db/index';

const VIEWS = ['sections', 'rivers', 'regions'];

/**
 * This patch adds estimated maps size column
 */
export async function up(db: Knex): Promise<void> {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.integer('maps_size').notNullable().defaultTo(0);
  });

  await createViews(db, 20, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.dropColumn('maps_size');
  });

  await createViews(db, 19, ...VIEWS);
}
