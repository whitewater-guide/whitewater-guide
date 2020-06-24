import { createViews, dropViews, runSqlFile } from '~/db';
import Knex from 'knex';

const VIEWS = ['sections'];
/**
 * This migration adds "help needed" field to sections
 */
export const up = async (db: Knex) => {
  // Add "region_name" column to "sections_view" as it's frequently used
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.text('help_needed');
  });
  await createViews(db, 29, ...VIEWS);
  await runSqlFile(db, './dist/migrations/029/upsert_section.sql');
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.dropColumn('help_needed');
  });
  await createViews(db, 28, ...VIEWS);
  await runSqlFile(db, './dist/migrations/027/upsert_section.sql');
};

export const configuration = { transaction: true };
