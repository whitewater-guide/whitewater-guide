import Knex = require('knex');
import { addUpdatedAtFunction, addUpdatedAtTrigger, removeUpdatedAtFunction } from '../db/updatedAtTrigger';
import { HarvestMode } from '../features/sources';
import { Role } from '../features/users/types';
import { POITypes } from '../ww-commons/features/points/POITypes';

export const up = async (db: Knex) => {
  await addUpdatedAtFunction(db);
  // USERS
  await db.schema.createTable('users', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('name').notNullable();
    table.string('avatar');
    table.string('email');
    table.integer('role').notNullable().defaultTo(Role.USER);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'users');

  // External logins with security tokens (e.g. Google, Facebook, Twitter)
  await db.schema.createTable('logins', (table) => {
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('provider', 16).notNullable();
    table.string('id').notNullable();
    table.string('username').notNullable();
    table.jsonb('tokens').notNullable();
    table.jsonb('profile').notNullable();
    table.timestamps(false, true);
    table.primary(['provider', 'id']);
  });
  await addUpdatedAtTrigger(db, 'logins');
  // SOURCES
  await db.schema.createTableIfNotExists('sources', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('name').notNullable();
    table.string('script', 20).notNullable();
    table.string('cron', 50);
    table.enu('harvest_mode', [HarvestMode.ALL_AT_ONCE, HarvestMode.ONE_BY_ONE]).notNullable();
    table.string('url', 500);
    table.boolean('enabled').notNullable().defaultTo(false);
    table.text('terms_of_use');
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'sources');

  // GAUGES
  await db.schema.createTableIfNotExists('gauges', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('source_id').notNullable().references('id').inTable('sources').onDelete('CASCADE');
    table.string('name').notNullable();
    table.string('code').notNullable().unique();
    table.string('level_unit');
    table.string('flow_unit');
    table.string('cron');
    table.string('request_params');
    table.dateTime('last_timestamp');
    table.string('url');
    table.boolean('enabled').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'gauges');

  // Regions
  await db.schema.createTableIfNotExists('regions', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('season');
    table.boolean('hidden').defaultTo(false);
    table.specificType('season_numeric', 'integer[]').notNullable().defaultTo('{}');
    table.specificType('bounds', 'geography(POLYGONZ,4326)');
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'regions');

  // Points
  await db.schema.createTableIfNotExists('points', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.string('name');
    table.text('description');
    table.enu('kind', POITypes).notNullable();
    table.specificType('coordinates', 'geography(POINTZ,4326)').notNullable();
  });

  // Points <-> regions many-to-many
  await db.schema.createTableIfNotExists('points_regions', (table) => {
    table.uuid('point_id').notNullable().references('id').inTable('points').onDelete('CASCADE');
    table.uuid('region_id').notNullable().references('id').inTable('regions').onDelete('CASCADE');
    table.primary(['point_id', 'region_id']);
  });

  // Sources <-> regions many-to-many
  await db.schema.createTableIfNotExists('sources_regions', (table) => {
    table.uuid('source_id').notNullable().references('id').inTable('sources');
    table.uuid('region_id').notNullable().references('id').inTable('regions');
    table.primary(['source_id', 'region_id']);
  });

  // Views
  await db.schema.raw(`
    CREATE OR REPLACE VIEW regions_view AS
    SELECT
      regions.id,
      regions.name,
      regions.description,
      regions.season,
      regions.season_numeric,
      regions.hidden,
      regions.created_at,
      regions.updated_at,
      ST_AsText(regions.bounds) AS bounds,
      json_agg(json_build_object(
                   'id', points.id,
                   'name', points.name,
                   'description', points.description,
                   'kind', points.kind,
                   'coordinates', ST_AsText(points.coordinates)
               )) FILTER (WHERE points.id NOTNULL) AS pois
    FROM regions
      LEFT OUTER JOIN points_regions ON regions.id = points_regions.region_id
      LEFT OUTER JOIN points ON points_regions.point_id = points.id
    GROUP BY regions.id
  `);
};

export const down = async (db: Knex) => {
  await db.schema.raw('DROP TABLE IF EXISTS sources_regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS logins CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS users CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS gauges CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sources CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points_regions CASCADE');
  await removeUpdatedAtFunction(db);
};

export const configuration = { transaction: true };
