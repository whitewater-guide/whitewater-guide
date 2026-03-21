import type { Knex } from 'knex';

import { createTable } from './utils/index';

/**
 * This patch adds table to store user's fcm tokens
 */
export async function up(db: Knex): Promise<void> {
  await createTable(db, 'fcm_tokens', (table) => {
    table
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.text('token').notNullable();

    table.primary(['user_id', 'token']);
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.dropTableIfExists('fcm_tokens');
}
