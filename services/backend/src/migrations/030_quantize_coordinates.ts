import { createViews, dropViews } from '~/db';
import Knex from 'knex';

const VIEWS = ['gauges', 'sections', 'rivers', 'regions', 'points'];
/**
 * Return only 4 digits after point in geometry
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  // Change "shape" column
  await dropViews(db, ...VIEWS);
  await createViews(db, 30, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await createViews(db, 29, ...VIEWS);
};

export const configuration = { transaction: true };
