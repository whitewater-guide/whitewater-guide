import { createViews, dropViews, runSqlFile } from '@db';
import Knex from 'knex';

/**
 * This patch adds 'demo' and 'hidden' columns to section table
 * Also updates view and upsert function
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table
      .boolean('demo')
      .notNullable()
      .defaultTo(false);
    table
      .boolean('hidden')
      .notNullable()
      .defaultTo(false)
      .index();
  });
  // Add these columns to views
  await dropViews(db, 'sections');
  await createViews(db, 3, 'sections');
  await runSqlFile(db, './dist/migrations/003/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await dropViews(db, 'sections');
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table.dropColumn('demo');
    table.dropColumn('hidden');
  });
  await createViews(db, 2, 'sections');
  await runSqlFile(db, './dist/migrations/001/upsert_section.sql');
};

export const configuration = { transaction: true };
