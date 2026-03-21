import type { Knex } from 'knex';

import { createViews, dropViews } from '../db/index';

const VIEWS = ['gauges', 'sections'];
/**
 * This patch is related to bug https://github.com/doomsower/whitewater/issues/197
 * WKX module cannot parse numbers in scientific notation
 * Replace ST_AsText to ST_AsGeoJSON everywhere
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  // Change "shape" column
  await dropViews(db, ...VIEWS);
  await createViews(db, 7, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await createViews(db, 6, ...VIEWS);
}
