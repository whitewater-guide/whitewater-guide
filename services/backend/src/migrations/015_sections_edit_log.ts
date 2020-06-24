import { createViews, dropViews } from '~/db';
import Knex from 'knex';
import { createTable } from './utils';

const VIEWS = ['sections'];
/**
 * Create table for sections edit log
 * https://github.com/doomsower/whitewater/issues/323
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  // Add "region_name" column to "sections_view" as it's frequently used
  await dropViews(db, ...VIEWS);
  await createViews(db, 15, ...VIEWS);

  // Store names and ids as strings, not as references, because
  // they might change with time, but we want to know their values
  // at the moment of action
  await createTable(db, 'sections_edit_log', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.uuid('section_id').notNullable();
    table.string('section_name').notNullable();
    table.uuid('river_id').notNullable();
    table.string('river_name').notNullable();
    table
      .uuid('region_id')
      .notNullable()
      .index();
    table.string('region_name').notNullable();
    table
      .uuid('editor_id')
      .notNullable()
      .references('id')
      .inTable('users');
    table.string('action').notNullable();
    table.json('diff');
    table
      .timestamp('created_at')
      .defaultTo(db.fn.now())
      .index();
  });

  // Load created_by
  await db.raw(`
    INSERT INTO sections_edit_log(section_id, section_name, river_id, river_name, region_id, region_name, editor_id, action, created_at)
    SELECT
      id,
      name,
      river_id,
      river_name,
      region_id,
      region_name,
      created_by,
      'create' as action,
      created_at
    FROM sections_view
    WHERE
      sections_view.created_by IS NOT NULL AND
      sections_view.language = 'en'
  `);
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await createViews(db, 14, ...VIEWS);
  await db.schema.dropTable('sections_edit_log');
};

export const configuration = { transaction: true };
