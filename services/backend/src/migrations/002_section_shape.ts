import { createViews, dropViews } from '~/db';
import Knex from 'knex';

const VIEWS = ['gauges', 'sections', 'rivers', 'regions', 'points'];
/**
 * This patch is related to bug https://github.com/doomsower/whitewater/issues/197
 * WKX module cannot parse numbers in scientific notation
 * Replace ST_AsText to ST_AsGeoJSON everywhere
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  // Change "shape" column
  await dropViews(db, ...VIEWS);
  await createViews(db, 2, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await createViews(db, 1, ...VIEWS);
};

export const configuration = { transaction: true };
