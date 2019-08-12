import { SuggestionStatus } from '@whitewater-guide/commons';
import Knex from 'knex';
import { createTable } from './utils';

/**
 * This patch adds user sections support
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await createTable(db, 'suggested_sections', (table) => {
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
      .uuid('resolved_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('resolved_at');
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(db.fn.now());
    table.jsonb('section');
  });
};

export const down = async (db: Knex) => {
  await db.schema.dropTableIfExists('suggested_sections');
};

export const configuration = { transaction: true };
