import type { Knex } from 'knex';

import { createTable } from './utils/index';

/**
 * This patch moves banners from regions column into separate tables
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('users', (table) => {
    table.text('email').nullable().alter();
    table.text('name').nullable().alter();

    table.text('password');
    table.boolean('verified').notNullable().defaultTo(false);
    table.jsonb('tokens').notNullable().defaultTo('[]');
  });

  // All existing users are facebook users and therefore are verified
  await db.raw(`UPDATE users
    SET verified = TRUE,
        email = CASE WHEN email = '' THEN NULL ELSE email END
  `);

  await db.schema.alterTable('users', (table) => {
    table.unique(['email']);
  });

  await createTable(db, 'tokens_blacklist', (table) => {
    table.text('token').notNullable().primary();

    table.timestamp('created_at').defaultTo(db.fn.now());
  });

  await db.schema.renameTable('logins', 'accounts');
}

export async function down(db: Knex): Promise<void> {
  await db.schema.renameTable('accounts', 'logins');

  await db.schema.dropTableIfExists('tokens_blacklist');

  await db.schema.alterTable('users', (table) => {
    table.dropUnique(['email']);
  });

  await db.table('users').update({ email: '' }).whereNull('email');

  await db.schema.alterTable('users', (table) => {
    table.text('name').notNullable().alter();

    table.text('email').notNullable().alter();

    table.dropColumn('password');
    table.dropColumn('verified');
    table.dropColumn('tokens');
  });
}
