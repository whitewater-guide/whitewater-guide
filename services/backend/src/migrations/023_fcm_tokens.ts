import Knex from 'knex';
import { createTable } from './utils';

/**
 * This patch adds table to store user's fcm tokens
 */
export const up = async (db: Knex) => {
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
};

export const down = async (db: Knex) => {
  await db.schema.dropTableIfExists('fcm_tokens');
};

export const configuration = { transaction: true };
