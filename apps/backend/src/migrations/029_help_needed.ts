import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

const VIEWS = ['sections'];
/**
 * This migration adds "help needed" field to sections
 */
export async function up(db: Knex): Promise<void> {
  // Add "region_name" column to "sections_view" as it's frequently used
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.text('help_needed');
  });
  await createViews(db, 29, ...VIEWS);
  await runSqlFile(db, resolveRelative(__dirname, '029/upsert_section.sql'));
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.dropColumn('help_needed');
  });
  await createViews(db, 28, ...VIEWS);
  await runSqlFile(db, resolveRelative(__dirname, '027/upsert_section.sql'));
}
