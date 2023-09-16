import type { Knex } from 'knex';

/**
 * For some reason, user.name field was nullable
 * But in actual data it's not
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('users', (table) => {
    table.string('name').notNullable().alter();
  });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('users', (table) => {
    table.string('name').nullable().alter();
  });
}
