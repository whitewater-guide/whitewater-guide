import { SuggestionStatus } from '@whitewater-guide/schema';
import type { Knex } from 'knex';

import { createTable } from './utils/index';

/**
 * This patch adds suggestions (edits and media)
 */
export async function up(db: Knex): Promise<void> {
  await createTable(db, 'suggestions', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();
    table.string('status').notNullable().defaultTo(SuggestionStatus.Pending);
    table
      .uuid('created_by')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('created_at').notNullable().defaultTo(db.fn.now());
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
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('suggestions');
}
