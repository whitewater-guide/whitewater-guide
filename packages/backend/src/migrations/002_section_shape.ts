import Knex from 'knex';
import { runSqlFile } from '../db';

/**
 * This patch is related to bug https://github.com/doomsower/whitewater/issues/197
 * WKX module cannot parse numbers in scientific notation
 * Replace ST_AsText to ST_AsGeoJSON everywhere
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  // Change "shape" column
  await db.raw('DROP VIEW gauges_view');
  await db.raw('DROP VIEW rivers_view');
  await db.raw('DROP VIEW regions_view');
  await db.raw('DROP VIEW sections_view');
  await db.raw('DROP VIEW points_view');
  await runSqlFile(db, './src/migrations/002/points_view.sql');
  await runSqlFile(db, './src/migrations/002/regions_view.sql');
  await runSqlFile(db, './src/migrations/initial/rivers_view.sql');
  await runSqlFile(db, './src/migrations/002/sections_view.sql');
  await runSqlFile(db, './src/migrations/initial/gauges_view.sql');
};

export const down = async (db: Knex) => {
  await db.raw('DROP VIEW gauges_view');
  await db.raw('DROP VIEW rivers_view');
  await db.raw('DROP VIEW regions_view');
  await db.raw('DROP VIEW sections_view');
  await db.raw('DROP VIEW points_view');
  await runSqlFile(db, './src/migrations/initial/points_view.sql');
  await runSqlFile(db, './src/migrations/initial/regions_view.sql');
  await runSqlFile(db, './src/migrations/initial/rivers_view.sql');
  await runSqlFile(db, './src/migrations/initial/sections_view.sql');
  await runSqlFile(db, './src/migrations/initial/gauges_view.sql');
};

export const configuration = { transaction: true };
