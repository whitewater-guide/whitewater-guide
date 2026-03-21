import type { Knex } from 'knex';

import { createViews, dropViews } from '../db/index';

const VIEWS = ['sections', 'rivers', 'regions'];
/**
 * This patch adds NOT NULL constraint to region.bounds
 * This was already in validation schema, so should be ok without data modifications
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.alterTable('regions', (table) => {
    table
      .specificType('bounds', 'geography(POLYGONZ,4326)')
      .notNullable()
      .alter();
  });
  await createViews(db, 13, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.alterTable('regions', (table) => {
    table.specificType('bounds', 'geography(POLYGONZ,4326)').nullable().alter();
  });
  await createViews(db, 12, ...VIEWS);
}
