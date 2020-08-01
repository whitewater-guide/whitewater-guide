import {
  addUpdatedAtFunction,
  addUpdatedAtTrigger,
  removeUpdatedAtFunction,
  runSqlFile,
} from '~/db';
import { POITypes } from '@whitewater-guide/commons';
import Knex from 'knex';
import { createTable } from './utils';

export const up = async (db: Knex) => {
  await runSqlFile(db, './dist/migrations/001/language_code.sql');
  await runSqlFile(db, './dist/migrations/001/tag_category.sql');
  await runSqlFile(db, './dist/migrations/001/media_kind.sql');
  await addUpdatedAtFunction(db);

  // USERS
  await createTable(db, 'users', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('name').notNullable();
    table.string('avatar');
    table.string('email');
    table
      .boolean('admin')
      .defaultTo(false)
      .notNullable();
    table.jsonb('editor_settings');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en');
    table
      .boolean('imperial')
      .notNullable()
      .defaultTo(false);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'users');

  // External accounts with security tokens (e.g. Google, Facebook, Twitter)
  await createTable(db, 'logins', (table) => {
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
  await createTable(db, 'sources', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('script', 20).notNullable();
    table.string('cron', 50);
    table.enu('harvest_mode', ['allAtOnce', 'oneByOne']).notNullable();
    table.string('url', 500);
    table
      .boolean('enabled')
      .notNullable()
      .defaultTo(false);
    table.timestamps(false, true);
  });
  await createTable(db, 'sources_translations', (table) => {
    table
      .uuid('source_id')
      .notNullable()
      .references('id')
      .inTable('sources')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table
      .string('name')
      .notNullable()
      .index();
    table.text('terms_of_use');
    table.primary(['source_id', 'language']);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'sources');
  await addUpdatedAtTrigger(db, 'sources_translations');

  // Region groups
  await createTable(db, 'groups', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('sku').index();
    table.timestamps(false, true);
  });
  await createTable(db, 'groups_translations', (table) => {
    table
      .uuid('group_id')
      .notNullable()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table
      .string('name')
      .notNullable()
      .index();
    table.primary(['group_id', 'language']);
  });

  // Regions
  await createTable(db, 'regions', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.boolean('hidden').defaultTo(false);
    table.boolean('premium').defaultTo(false);
    table.string('sku').index();
    table
      .specificType('season_numeric', 'integer[]')
      .notNullable()
      .defaultTo('{}');
    table.specificType('bounds', 'geography(POLYGONZ,4326)');
    table.timestamps(false, true);
  });
  await createTable(db, 'regions_translations', (table) => {
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table
      .string('name')
      .notNullable()
      .index();
    table.text('description');
    table.string('season');
    table.primary(['region_id', 'language']);
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'regions');
  await addUpdatedAtTrigger(db, 'regions_translations');

  // Users (editors) <-> regions many-to-many
  await createTable(db, 'regions_editors', (table) => {
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.primary(['user_id', 'region_id']);
  });

  // Groups <-> regions many-to-many
  await createTable(db, 'regions_groups', (table) => {
    table
      .uuid('group_id')
      .notNullable()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.primary(['group_id', 'region_id']);
  });

  // Points
  await createTable(db, 'points', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.enu('kind', POITypes).notNullable();
    table.specificType('coordinates', 'geography(POINTZ,4326)').notNullable();
  });
  await createTable(db, 'points_translations', (table) => {
    table
      .uuid('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.string('name').index();
    table.text('description');
    table.primary(['point_id', 'language']);
  });

  // GAUGES
  await createTable(db, 'gauges', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('source_id')
      .notNullable()
      .references('id')
      .inTable('sources')
      .onDelete('CASCADE')
      .index();
    table
      .uuid('location_id')
      .references('id')
      .inTable('points')
      .onDelete('SET NULL');
    table
      .string('code')
      .notNullable()
      .index();
    table.unique(['source_id', 'code']);
    table.string('level_unit');
    table.string('flow_unit');
    table.string('cron');
    table.specificType('request_params', 'json');
    table.string('url');
    table
      .boolean('enabled')
      .notNullable()
      .defaultTo(false);
    table.timestamps(false, true);
  });
  await createTable(db, 'gauges_translations', (table) => {
    table
      .uuid('gauge_id')
      .notNullable()
      .references('id')
      .inTable('gauges')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.primary(['gauge_id', 'language']);
    table
      .string('name')
      .notNullable()
      .index();
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'gauges');
  await addUpdatedAtTrigger(db, 'gauges_translations');

  // Rivers
  await createTable(db, 'rivers', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE')
      .index();
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(false, true);
  });
  await createTable(db, 'rivers_translations', (table) => {
    table
      .uuid('river_id')
      .notNullable()
      .references('id')
      .inTable('rivers')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.primary(['river_id', 'language']);
    table
      .string('name')
      .notNullable()
      .index();
    table
      .specificType('alt_names', 'varchar[]')
      .notNullable()
      .defaultTo('{}');
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'rivers');
  await addUpdatedAtTrigger(db, 'rivers_translations');

  // Points <-> regions many-to-many
  await createTable(db, 'regions_points', (table) => {
    table
      .uuid('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
      .onDelete('CASCADE');
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.primary(['point_id', 'region_id']);
  });

  // Sources <-> regions many-to-many
  await createTable(db, 'sources_regions', (table) => {
    table
      .uuid('source_id')
      .notNullable()
      .references('id')
      .inTable('sources')
      .onDelete('CASCADE');
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.primary(['source_id', 'region_id']);
  });

  // Tags
  await createTable(db, 'tags', (table) => {
    table.string('id').primary();
    table
      .specificType('category', 'tag_category')
      .notNullable()
      .index();
  });
  await createTable(db, 'tags_translations', (table) => {
    table
      .string('tag_id')
      .notNullable()
      .references('id')
      .inTable('tags')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.primary(['tag_id', 'language']);
    table
      .string('name')
      .notNullable()
      .index();
  });

  // Sections
  await createTable(db, 'sections', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .uuid('river_id')
      .notNullable()
      .references('id')
      .inTable('rivers')
      .onDelete('CASCADE')
      .index();
    table
      .uuid('gauge_id')
      .references('id')
      .inTable('gauges')
      .onDelete('SET NULL');
    table
      .specificType('season_numeric', 'integer[]')
      .notNullable()
      .defaultTo('{}');
    table.jsonb('levels');
    table.jsonb('flows');
    table.specificType('shape', 'geography(LINESTRINGZ,4326)');
    table.float('distance');
    table.float('drop');
    table.integer('duration');
    table.float('difficulty');
    table.string('difficulty_xtra', 32);
    table.float('rating');
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table.timestamps(false, true);
  });
  await createTable(db, 'sections_translations', (table) => {
    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.primary(['section_id', 'language']);

    table
      .string('name')
      .notNullable()
      .index();
    table
      .specificType('alt_names', 'varchar[]')
      .notNullable()
      .defaultTo('{}');
    table.text('description');
    table.string('season');
    table.string('flows_text');

    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'sections');
  await addUpdatedAtTrigger(db, 'sections_translations');
  // Points <-> sections POIS many-to-many
  await createTable(db, 'sections_points', (table) => {
    table
      .uuid('point_id')
      .notNullable()
      .references('id')
      .inTable('points')
      .onDelete('CASCADE');
    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');
    table.primary(['point_id', 'section_id']);
  });
  // Tags <-> sections many-to-many
  await createTable(db, 'sections_tags', (table) => {
    table
      .string('tag_id')
      .notNullable()
      .references('id')
      .inTable('tags')
      .onDelete('CASCADE');
    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');
    table.primary(['tag_id', 'section_id']);
  });

  // No primary key here! But single measurement is never referenced
  await db.schema.createTable('measurements', (table) => {
    table.timestamp('timestamp').notNullable();
    table.string('script').notNullable();
    table.string('code').notNullable();
    table.float('flow');
    table.float('level');
    table.index(['script', 'code']);
  });
  // index
  await db.schema.raw(
    'CREATE UNIQUE INDEX measurements_idx ON measurements (script, code, timestamp DESC)',
  );
  // Init timescale!
  await db.schema.raw("SELECT create_hypertable('measurements', 'timestamp');");

  // Media
  await createTable(db, 'media', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .specificType('kind', 'media_kind')
      .notNullable()
      .index();
    table.string('url').notNullable();
    table.specificType('resolution', 'integer[]');
    table
      .integer('weight')
      .notNullable()
      .defaultTo(0);
    table.timestamps(false, true);
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
  });
  await createTable(db, 'media_translations', (table) => {
    table
      .uuid('media_id')
      .notNullable()
      .references('id')
      .inTable('media')
      .onDelete('CASCADE');
    table
      .specificType('language', 'language_code')
      .notNullable()
      .defaultTo('en')
      .index();
    table.primary(['media_id', 'language']);
    table.text('description');
    table.string('copyright');
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'media');
  await addUpdatedAtTrigger(db, 'media_translations');
  // Media <-> sections
  await createTable(db, 'sections_media', (table) => {
    table
      .uuid('media_id')
      .notNullable()
      .references('id')
      .inTable('media')
      .onDelete('CASCADE')
      .unique();
    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');
    table.primary(['media_id', 'section_id']);
  });

  if (process.env.AUTO_SEED === 'true') {
    await createTable(db, 'seeds_lock', (table) => {
      table.boolean('locked');
    });
    await db.into('seeds_lock').insert({ locked: false });
  }

  await createTable(db, 'purchases', (table) => {
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.enu('platform', ['ios', 'android']).index();
    table.string('sku');
    table.primary(['user_id', 'platform', 'sku']);
    table.jsonb('receipt');
    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'purchases');

  await runSqlFile(db, './dist/migrations/001/array_json_to_int.sql');
  await runSqlFile(db, './dist/migrations/001/array_json_to_varchar.sql');
  await runSqlFile(db, './dist/migrations/001/point_from_json.sql');
  await runSqlFile(db, './dist/migrations/001/polygon_from_json.sql');
  await runSqlFile(db, './dist/migrations/001/linestring_from_json.sql');
  await runSqlFile(db, './dist/migrations/001/points_view.sql');
  await runSqlFile(db, './dist/migrations/001/tags_view.sql');
  await runSqlFile(db, './dist/migrations/001/regions_view.sql');
  await runSqlFile(db, './dist/migrations/001/groups_view.sql');
  await runSqlFile(db, './dist/migrations/001/sections_view.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_points.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_region.sql');
  await runSqlFile(db, './dist/migrations/001/regions_points_trigger.sql');
  await runSqlFile(db, './dist/migrations/001/sections_points_trigger.sql');
  await runSqlFile(db, './dist/migrations/001/gauges_points_trigger.sql');
  await runSqlFile(db, './dist/migrations/001/sources_view.sql');
  await runSqlFile(db, './dist/migrations/001/gauges_view.sql');
  await runSqlFile(db, './dist/migrations/001/rivers_view.sql');
  await runSqlFile(db, './dist/migrations/001/media_view.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_group.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_tag.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_river.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_source.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_gauge.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_section.sql');
  await runSqlFile(db, './dist/migrations/001/upsert_section_media.sql');
};

export const down = async (db: Knex) => {
  await db.schema.raw('DROP TABLE IF EXISTS sources_regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS logins CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS users CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS gauges CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS gauges_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sections CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sections_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sections_points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sections_tags CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sections_media CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sources CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS sources_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS groups CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS groups_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_editors CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS regions_groups CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS points_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS rivers CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS rivers_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS tags CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS tags_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS measurements CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS media CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS media_translations CASCADE');
  await db.schema.raw('DROP TABLE IF EXISTS purchases CASCADE');
  await db.schema.raw('DROP VIEW IF EXISTS tags_view');
  await db.schema.raw('DROP VIEW IF EXISTS groups_view');
  await db.schema.raw('DROP VIEW IF EXISTS regions_view');
  await db.schema.raw('DROP VIEW IF EXISTS points_view');
  await db.schema.raw('DROP VIEW IF EXISTS gauges_view');
  await db.schema.raw('DROP VIEW IF EXISTS sources_view');
  await db.schema.raw('DROP VIEW IF EXISTS rivers_view');
  await db.schema.raw('DROP VIEW IF EXISTS sections_view');
  await db.schema.raw('DROP VIEW IF EXISTS media_view');
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section_media(section_id VARCHAR, media JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_section(section JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_group(grp JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_tag(tag JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_region(r JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_points(points_array JSON[], lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_source(src JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_gauge(gauge JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_river(river JSON, lang language_code) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS trigger_delete_orphan_sections_points() CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS trigger_delete_orphan_regions_points() CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS trigger_delete_orphan_gauges_points() CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS array_json_to_int(p_input json) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS array_json_to_varchar(p_input json) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS point_from_json(point JSON) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS polygon_from_json(polygon JSON) CASCADE',
  );
  await db.schema.raw(
    'DROP FUNCTION IF EXISTS linestring_from_json(linestring JSON) CASCADE',
  );
  await db.schema.raw('DROP TYPE IF EXISTS language_code CASCADE');
  await db.schema.raw('DROP TYPE IF EXISTS tag_category CASCADE');
  await db.schema.raw('DROP TYPE IF EXISTS media_kind CASCADE');
  await removeUpdatedAtFunction(db);
};

export const configuration = { transaction: true };
