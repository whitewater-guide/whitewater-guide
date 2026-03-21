import type { Knex } from 'knex';

import { createViews, dropViews, runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

const VIEWS = ['gauges', 'sources'];
/**
 * This migration remove workers scheduling from backend.
 * Scheduling is now done in gorge service
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sources', (table) => {
    table.dropColumn('enabled');
    table.dropColumn('harvest_mode');
  });
  await db.schema.table('gauges', (table) => {
    table.dropColumn('enabled');
    table.dropColumn('cron');
  });
  await runSqlFile(db, resolveRelative(__dirname, '031/upsert_source.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '031/upsert_gauge.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '031/jobs_view.sql'));
  await createViews(db, 31, ...VIEWS);
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.raw('DROP VIEW IF EXISTS jobs_view');
  await db.schema.alterTable('sources', (table) => {
    table
      .enu('harvest_mode', ['allAtOnce', 'oneByOne'])
      .notNullable()
      .defaultTo('allAtOnce'); // this should never happen
    table.boolean('enabled').notNullable().defaultTo(false);
  });
  await db.schema.alterTable('gauges', (table) => {
    table.boolean('enabled').notNullable().defaultTo(false);
    table.string('cron');
  });
  await runSqlFile(db, resolveRelative(__dirname, '018/upsert_source.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '001/upsert_gauge.sql'));
  await createViews(db, 30, ...VIEWS);
}
