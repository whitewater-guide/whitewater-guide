import type { Knex } from 'knex';

/**
 * This loads norway map by Evgeny Smirnov
 * Also adds fields to rivers and sections tables to indicate such import
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.table('sections', (table) => {
    table.string('import_id');
  });
  await db.schema.table('rivers', (table) => {
    table.string('import_id');
  });
  // Data migrations are no longer available is source code
}

export async function down(db: Knex): Promise<void> {
  await db.schema.table('sections', (table) => {
    table.dropColumn('import_id');
  });
  await db.schema.table('rivers', (table) => {
    table.dropColumn('import_id');
  });
}
