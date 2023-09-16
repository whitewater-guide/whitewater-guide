import type { Knex } from 'knex';

import { createViews, dropViews } from '../db/index';

const VIEWS = ['rivers', 'regions'];
/**
 * This patch adds cover image column to region
 */
export async function up(db: Knex): Promise<void> {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add cover image
  await db.schema.table('regions', (table) => {
    table.jsonb('cover_image').notNullable().defaultTo('{}');
    table.jsonb('banners').notNullable().defaultTo('{}');
  });

  await createViews(db, 6, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.dropColumn('cover_image');
    table.dropColumn('banners');
  });

  await createViews(db, 5, ...VIEWS);
}
