import Knex = require('knex');
import { runSqlFile } from '../db/runSqlFile';
import { addUpdatedAtFunction, addUpdatedAtTrigger, removeUpdatedAtFunction } from '../db/updatedAtTrigger';
import { Role } from '../features/users/types';
import { HarvestMode, POITypes } from '../ww-commons';

export const up = async (db: Knex) => {
  await runSqlFile(db, './src/migrations/initial/language_code.sql');
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
    table.string('script', 20).notNullable();
    table.string('cron', 50);
    table.enu('harvest_mode', [HarvestMode.ALL_AT_ONCE, HarvestMode.ONE_BY_ONE]).notNullable();
    table.string('url', 500);
    table.boolean('enabled').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });
  await db.schema.createTableIfNotExists('sources_translations', (table) => {
    table
      .uuid('source_id')
      .notNullable()
      .references('id')
      .inTable('sources')
      .onDelete('CASCADE');
    table.specificType('language', 'language_code').notNullable().defaultTo('en').index();
    table.string('name').notNullable().index();
    table.text('terms_of_use');
    table.primary(['source_id', 'language']);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'sources');
  await addUpdatedAtTrigger(db, 'sources_translations');

  // Regions
  await db.schema.createTableIfNotExists('regions', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.boolean('hidden').defaultTo(false);
    table.specificType('season_numeric', 'integer[]').notNullable().defaultTo('{}');
    table.specificType('bounds', 'geography(POLYGONZ,4326)');
    table.timestamps(false, true);
  });
  await db.schema.createTableIfNotExists('regions_translations', (table) => {
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.specificType('language', 'language_code').notNullable().defaultTo('en').index();
    table.string('name').notNullable().index();
    table.text('description');
    table.string('season');
    table.primary(['region_id', 'language']);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'regions');
  await addUpdatedAtTrigger(db, 'regions_translations');

  // Points
  await db.schema.createTableIfNotExists('points', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.enu('kind', POITypes).notNullable();
    table.specificType('coordinates', 'geography(POINTZ,4326)').notNullable();
  });
  await db.schema.createTableIfNotExists('points_translations', (table) => {
    table
      .uuid('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
      .onDelete('CASCADE');
    table.specificType('language', 'language_code').notNullable().defaultTo('en').index();
    table.string('name').index();
    table.text('description');
    table.primary(['point_id', 'language']);
  });

  // GAUGES
  await db.schema.createTableIfNotExists('gauges', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('source_id').notNullable().references('id').inTable('sources').onDelete('CASCADE').index();
    table.uuid('location_id').references('id').inTable('points').onDelete('SET NULL');
    table.string('code').notNullable().index();
    table.unique(['source_id', 'code']);
    table.string('level_unit');
    table.string('flow_unit');
    table.string('cron');
    table.specificType('request_params', 'json');
    table.string('url');
    table.boolean('enabled').notNullable().defaultTo(false);
    table.timestamps(false, true);
  });
  await db.schema.createTableIfNotExists('gauges_translations', (table) => {
    table
      .uuid('gauge_id')
      .notNullable()
      .references('id')
      .inTable('gauges')
      .onDelete('CASCADE');
    table.specificType('language', 'language_code').notNullable().defaultTo('en').index();
    table.primary(['gauge_id', 'language']);
    table.string('name').notNullable().index();
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'gauges');
  await addUpdatedAtTrigger(db, 'gauges_translations');

  // Rivers
  await db.schema.createTableIfNotExists('rivers', (table) => {
    table.uuid('id').notNullable().defaultTo(db.raw('uuid_generate_v1mc()')).primary();
    table.uuid('region_id').notNullable().references('id').inTable('regions').onDelete('CASCADE').index();
    table.timestamps(false, true);
  });
  await db.schema.createTableIfNotExists('rivers_translations', (table) => {
    table
      .uuid('river_id')
      .notNullable()
      .references('id')
      .inTable('rivers')
      .onDelete('CASCADE');
    table.specificType('language', 'language_code').notNullable().defaultTo('en').index();
    table.primary(['river_id', 'language']);
    table.string('name').notNullable().index();
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'rivers');
  await addUpdatedAtTrigger(db, 'rivers_translations');

  // Points <-> regions many-to-many
  await db.schema.createTableIfNotExists('regions_points', (table) => {
    table.uuid('point_id').notNullable().references('id').inTable('points').onDelete('CASCADE');
    table.uuid('region_id').notNullable().references('id').inTable('regions').onDelete('CASCADE');
    table.primary(['point_id', 'region_id']);
  });

  // Sources <-> regions many-to-many
  await db.schema.createTableIfNotExists('sources_regions', (table) => {
    table.uuid('source_id').notNullable().references('id').inTable('sources').onDelete('CASCADE');
    table.uuid('region_id').notNullable().references('id').inTable('regions').onDelete('CASCADE');
    table.primary(['source_id', 'region_id']);
  });

  await runSqlFile(db, './src/migrations/initial/array_json_to_int.sql');
  await runSqlFile(db, './src/migrations/initial/point_from_json.sql');
  await runSqlFile(db, './src/migrations/initial/polygon_from_json.sql');
  await runSqlFile(db, './src/migrations/initial/points_view.sql');
  await runSqlFile(db, './src/migrations/initial/regions_view.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_points.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_region.sql');
  await runSqlFile(db, './src/migrations/initial/regions_points_trigger.sql');
  await runSqlFile(db, './src/migrations/initial/gauges_points_trigger.sql');
  await runSqlFile(db, './src/migrations/initial/sources_view.sql');
  await runSqlFile(db, './src/migrations/initial/gauges_view.sql');
  await runSqlFile(db, './src/migrations/initial/rivers_view.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_river.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_source.sql');
  await runSqlFile(db, './src/migrations/initial/upsert_gauge.sql');
};

export const down = async (db: Knex) => {
  await db.schema.raw('DROP TABLE IF EXISTS sources_regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS logins CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS users CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS gauges CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS gauges_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sources CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sources_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS rivers CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS rivers_translations CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS array_json_to_int(p_input json) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS point_from_json(point JSON) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS polygon_from_json(polygon JSON) CASCADE');
  await db.schema.raw('DROP VIEW IF EXISTS regions_view');
  await db.schema.raw('DROP VIEW IF EXISTS points_view');
  await db.schema.raw('DROP VIEW IF EXISTS gauges_view');
  await db.schema.raw('DROP VIEW IF EXISTS sources_view');
  await db.schema.raw('DROP VIEW IF EXISTS rivers_view');
  await db.schema.raw('DROP TYPE IF EXISTS language_code CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS upsert_region(r JSON, lang language_code) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS upsert_points(points_array JSON[], lang language_code) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS upsert_source(src JSON, lang language_code) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS upsert_gauge(gauge JSON, lang language_code) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS upsert_river(river JSON, lang language_code) CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS trigger_delete_orphan_regions_points() CASCADE');
  await db.schema.raw('DROP FUNCTION IF EXISTS trigger_delete_orphan_gauges_points() CASCADE');
  await removeUpdatedAtFunction(db);
};

export const configuration = { transaction: true };
