import type { Knex } from 'knex';

import { createTable } from './utils/index';

/**
 * This migration adds tables for favorite regions and sections
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
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
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTable('fav_regions');
  await db.schema.dropTable('fav_sections');
}
