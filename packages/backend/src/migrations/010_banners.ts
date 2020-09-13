import Knex from 'knex';
import path from 'path';

import { createViews, dropViews, runSqlFile } from '~/db';

import { createTable } from './utils';

const VIEWS = ['sections', 'rivers', 'regions'];

/**
 * This patch moves banners from regions column into separate tables
 */
export const up = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.dropColumn('banners');
  });

  await createTable(db, 'banners', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.text('name').notNullable().unique();
    table.string('slug').notNullable().unique();
    table.float('priority').notNullable().index();
    table.boolean('enabled').notNullable();
    table.string('placement').notNullable();
    table.jsonb('source').notNullable();
    table.text('link');
    table.jsonb('extras');
  });
  await createTable(db, 'banners_regions', (table) => {
    table
      .uuid('banner_id')
      .notNullable()
      .references('id')
      .inTable('banners')
      .onDelete('CASCADE');
    table
      .uuid('region_id')
      .notNullable()
      .references('id')
      .inTable('regions')
      .onDelete('CASCADE');
    table.primary(['banner_id', 'region_id']);
  });
  await createTable(db, 'banners_groups', (table) => {
    table
      .uuid('banner_id')
      .notNullable()
      .references('id')
      .inTable('banners')
      .onDelete('CASCADE');
    table
      .uuid('group_id')
      .notNullable()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table.primary(['banner_id', 'group_id']);
  });
  await runSqlFile(db, path.resolve(__dirname, '010/upsert_banner.sql'));

  await createViews(db, 10, ...VIEWS);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);

  await db.schema.table('regions', (table) => {
    table.jsonb('banners').notNullable().defaultTo('{}');
  });

  await db.schema.raw(
    'DROP FUNCTION IF EXISTS upsert_banner(banner JSON) CASCADE',
  );

  await db.schema.dropTableIfExists('banners_regions');
  await db.schema.dropTableIfExists('banners_groups');
  await db.schema.dropTableIfExists('banners');

  await createViews(db, 9, ...VIEWS);
};

export const configuration = { transaction: true };
