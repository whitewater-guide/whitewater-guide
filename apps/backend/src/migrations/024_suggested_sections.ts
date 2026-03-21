import { SuggestionStatus } from '@whitewater-guide/schema';
import type { Knex } from 'knex';

import { createTable } from './utils/index';

/**
 * This patch adds user sections support
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  await createTable(db, 'suggested_sections', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('status').notNullable().defaultTo(SuggestionStatus.Pending);
    table
      .uuid('resolved_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('resolved_at');
    table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
    table.jsonb('section');
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('suggested_sections');
}
