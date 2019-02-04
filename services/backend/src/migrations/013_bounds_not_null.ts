import { createViews, dropViews } from '@db';
import Knex from 'knex';

const VIEWS = ['sections', 'rivers', 'regions'];
/**
 * This patch adds NOT NULL constraint to region.bounds
 * This was already in validation schema, so should be ok without data modifications
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.schema.alterTable('regions', (table) => {
    table
      .specificType('bounds', 'geography(POLYGONZ,4326)')
      .notNullable()
      .alter();
  });
  await createViews(db, 13, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.schema.alterTable('regions', (table) => {
    table
      .specificType('bounds', 'geography(POLYGONZ,4326)')
      .nullable()
      .alter();
  });
  await createViews(db, 12, ...VIEWS);
};

export const configuration = { transaction: true };
