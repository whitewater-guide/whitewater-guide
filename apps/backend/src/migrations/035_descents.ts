import type { Knex } from 'knex';

import { addUpdatedAtTrigger } from '../db/index';
import { createTable } from './utils/index';

/**
 * This patch adds descents (logbook entries)
 */
export async function up(db: Knex): Promise<void> {
  await createTable(db, 'descents', (table) => {
    table
      .uuid('id')
      .notNullable()
      .defaultTo(db.raw('uuid_generate_v1mc()'))
      .primary();

    table.specificType('ord_id', 'serial').index();

    table
      .uuid('parent_id')
      .references('id')
      .inTable('descents')
      .onDelete('SET NULL');

    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');

    table
      .uuid('section_id')
      .notNullable()
      .references('id')
      .inTable('sections')
      .onDelete('CASCADE');

    table.text('comment');

    table.timestamp('started_at').notNullable().index();

    table.integer('duration');

    table.float('level_value').index();
    table.string('level_unit');
    table.boolean('public').notNullable().defaultTo(true).index();

    table.timestamps(false, true);
  });
  await addUpdatedAtTrigger(db, 'descents');
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('descents');
}
