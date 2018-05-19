import Knex from 'knex';
import { runSqlFile } from '../db';

/**
 * This patch adds 'demo' and 'hidden' columns to section table
 * Also updates view and upsert function
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table.boolean('demo').notNullable().defaultTo(false);
    table.boolean('hidden').notNullable().defaultTo(false).index();
  });
  // Add these columns to views
  await db.raw('DROP VIEW sections_view');
  await runSqlFile(db, './src/migrations/003/sections_view.sql');
  await runSqlFile(db, './src/migrations/003/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await db.raw('DROP VIEW sections_view');
  await db.schema.table('sections', (table) => {
    // Demo section - free section in premium region
    table.dropColumn('demo');
    table.dropColumn('hidden');
  });
  await runSqlFile(db, './src/migrations/002/sections_view.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_section.sql');
};

export const configuration = { transaction: true };
