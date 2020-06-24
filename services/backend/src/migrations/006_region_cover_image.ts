import { createViews, dropViews } from '~/db';
import Knex from 'knex';

const VIEWS = ['rivers', 'regions'];
/**
 * This patch adds cover image column to region
 */
export const up = async (db: Knex) => {
  // Need to drop views first
  await dropViews(db, ...VIEWS);

  // Add cover image
  await db.schema.table('regions', (table) => {
    table
      .jsonb('cover_image')
      .notNullable()
      .defaultTo('{}');
    table
      .jsonb('banners')
      .notNullable()
      .defaultTo('{}');
  });

  await createViews(db, 6, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.dropColumn('cover_image');
    table.dropColumn('banners');
  });

  await createViews(db, 5, ...VIEWS);
};

export const configuration = { transaction: true };
