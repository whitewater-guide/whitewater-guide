import { Feature, Geometry } from '@turf/helpers';
import { createReadStream, pathExists } from 'fs-extra';
import JSONStream from 'jsonstream2';
import Knex from 'knex';
import * as path from 'path';

import { createViews, dropViews, runSqlFileVersion } from '~/db';

import { createTable } from './utils';

const VIEWS = ['gauges', 'sections'];

async function populateTzTable(db: Knex): Promise<void> {
  const jsonPath = path.resolve(__dirname, '042/combined-with-oceans.json');
  const exists = await pathExists(jsonPath);
  if (!exists) {
    console.info('timzeones geojson not found');
    return;
  }
  const fileStream = createReadStream(jsonPath, 'utf-8');
  const features = fileStream.pipe(JSONStream.parse('features.*'));
  for await (const f of features) {
    const feature = f as any as Feature<Geometry, { tzid: string }>;
    await db
      .insert({ name: feature.properties.tzid, geometry: feature.geometry })
      .into('tz_geometries');
  }
}

/**
 * This patch adds timezone field to gauges and sections
 *
 * It creates special tz_geometries table and populates it with data from https://github.com/evansiroky/timezone-boundary-builder
 * It adds two helper functions to get timezone name from longitude and latitude
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('sections', (table) => {
    table.text('timezone').nullable();
  });
  await db.schema.table('gauges', (table) => {
    table.text('timezone').nullable();
  });
  await createTable(db, 'tz_geometries', (table) => {
    table.increments('id');
    table.text('name').notNullable().unique();
    table.specificType('geometry', 'geometry');
    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  await createViews(db, 42, ...VIEWS);

  await runSqlFileVersion(db, 'upsert_section.sql', 42);
  await runSqlFileVersion(db, 'upsert_gauge.sql', 42);
  await runSqlFileVersion(db, 'tz_from_lon_lat.sql', 42);
  await runSqlFileVersion(db, 'tz_from_point.sql', 42);

  await populateTzTable(db);

  // Set timezone for existing sections
  await db.raw(
    'UPDATE sections SET timezone = tz_from_point(ST_AsGeoJSON(st_startpoint(sections.shape :: geometry)) :: JSON)',
  );
  // and gauges
  await db.raw(`
    UPDATE gauges
    SET timezone = tz_from_point(ST_AsGeoJSON(points.coordinates :: geometry) :: JSON)
    FROM points
    WHERE gauges.location_id = points.id
    `);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.raw('DROP FUNCTION IF EXISTS tz_from_point(point JSON) CASCADE');
  await db.raw(
    'DROP FUNCTION IF EXISTS tz_from_lon_lat(lon float, lat float) CASCADE',
  );

  await db.schema.dropTable('tz_geometries');

  await db.schema.table('sections', (table) => {
    table.dropColumn('timezone');
  });
  await db.schema.table('gauges', (table) => {
    table.dropColumn('timezone');
  });

  await createViews(db, 41, ...VIEWS);

  await runSqlFileVersion(db, 'upsert_section.sql', 41);
  await runSqlFileVersion(db, 'upsert_gauge.sql', 41);
};

export const configuration = { transaction: true };
