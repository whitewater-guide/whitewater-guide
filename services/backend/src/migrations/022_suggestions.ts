import Knex from 'knex';
import { SuggestionStatus } from '../features/suggestions/types';
import { createTable } from './utils';

/**
 * This patch adds suggestions (edits and media)
 */
export const up = async (db: Knex) => {
  await createTable(db, 'suggestions', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table
      .string('status')
      .notNullable()
      .defaultTo(SuggestionStatus.PENDING);
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(db.fn.now());
    table
      .uuid('resolved_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('resolved_at');

    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');

    table.text('description');
    table.text('copyright');
    table.string('filename');
    table.specificType('resolution', 'integer[]');
  });
};

export const down = async (db: Knex) => {
  await db.schema.dropTableIfExists('suggestions');
};

export const configuration = { transaction: true };
