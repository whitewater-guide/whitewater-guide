import type { Knex } from 'knex';

import { runSqlFile } from '../db/index';
import { resolveRelative } from '../utils/index';

/**
 * This patch modifies sql functions that convert JSON to postgis data
 * in a way that supports both Coordinate3d and Coordinate2d inputs
 */
export async function up(db: Knex): Promise<void> {
  await runSqlFile(
    db,
    resolveRelative(__dirname, '026/linestring_from_json.sql'),
  );
  await runSqlFile(db, resolveRelative(__dirname, '026/point_from_json.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '026/polygon_from_json.sql'));
}

export async function down(db: Knex): Promise<void> {
  await runSqlFile(
    db,
    resolveRelative(__dirname, '001/linestring_from_json.sql'),
  );
  await runSqlFile(db, resolveRelative(__dirname, '001/point_from_json.sql'));
  await runSqlFile(db, resolveRelative(__dirname, '001/polygon_from_json.sql'));
}
