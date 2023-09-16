import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This patch adds 'demo' and 'hidden' columns to section table
 * Also updates view and upsert function
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table.boolean('demo').notNullable().defaultTo(false);
    table.boolean('hidden').notNullable().defaultTo(false).index();
  });
  // Add these columns to views
  await dropViews(db, 'sections');
  await createViews(db, 3, 'sections');
  await runSqlFile(db, resolveRelative(__dirname, '003/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, 'sections');
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table.dropColumn('demo');
    table.dropColumn('hidden');
  });
  await createViews(db, 2, 'sections');
  await runSqlFile(db, resolveRelative(__dirname, '001/upsert_section.sql'));
}
