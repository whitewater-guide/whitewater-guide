import Knex from 'knex';
import path from 'path';

import { runSqlFile } from '~/db';

/**
 * This patch modifies sql functions that convert JSON to postgis data
 * in a way that supports both Coordinate3d and Coordinate2d inputs
 */
export const up = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '026/linestring_from_json.sql'));
  await runSqlFile(db, path.resolve(__dirname, '026/point_from_json.sql'));
  await runSqlFile(db, path.resolve(__dirname, '026/polygon_from_json.sql'));
};

export const down = async (db: Knex) => {
  await runSqlFile(db, path.resolve(__dirname, '001/linestring_from_json.sql'));
  await runSqlFile(db, path.resolve(__dirname, '001/point_from_json.sql'));
  await runSqlFile(db, path.resolve(__dirname, '001/polygon_from_json.sql'));
};

export const configuration = { transaction: true };
