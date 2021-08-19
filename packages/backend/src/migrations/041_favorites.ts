import Knex from 'knex';

import { createTable } from './utils';

/**
 * This migration adds tables for favorite regions and sections
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await createTable(db, 'fav_regions', (table) => {
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
  await createTable(db, 'fav_sections', (table) => {
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');
    table.primary(['user_id', 'section_id']);
  });
};

export const down = async (db: Knex) => {
  await db.schema.dropTable('fav_regions');
  await db.schema.dropTable('fav_sections');
};

export const configuration = { transaction: true };
