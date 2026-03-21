import type { Knex } from 'knex';

import { createViews, dropViews } from '../db/index';

const VIEWS = ['gauges', 'sections', 'rivers', 'regions', 'points'];
/**
 * Return only 4 digits after point in geometry
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  // Change "shape" column
  await dropViews(db, ...VIEWS);
  await createViews(db, 30, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await createViews(db, 29, ...VIEWS);
}
