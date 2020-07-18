import { SuggestionStatus } from '@whitewater-guide/commons';
import Knex from 'knex';
import { createTable } from './utils';
import { addUpdatedAtTrigger } from '~/db';

/**
 * This patch adds descents (logbook entries)
 */
export const up = async (db: Knex) => {
  await createTable(db, 'descents', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();

    table
      .uuid('parent_id')
      .references('id')
      .inTable('descents')
      .onDelete('SET NULL');

    table.increments('ord_id').index();

    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections');

    table.text('comment');

    table
      .timestamp('started_at')
      .notNullable()
      .index();

    table.integer('duration');

    table.float('level_value').index();
    table.string('level_unit');
    table
      .boolean('public')
      .notNullable()
      .defaultTo(true)
      .index();

    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'descents');
};

export const down = async (db: Knex) => {
  await db.schema.dropTableIfExists('descents');
};

export const configuration = { transaction: true };
