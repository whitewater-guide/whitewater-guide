import type { Knex } from 'knex';

/**
 * This patch makes social tokens column optional and clears values
 * It's not really used anywhere, and tokens are not refreshed since being exchanged to or tokens
 * Same for social profile
 */
export async function up(db: Knex): Promise<void> {
  await db.schema.alterTable('accounts', (table) => {
    table.jsonb('tokens').nullable().alter();
    table.jsonb('profile').nullable().alter();
  });
  await db.table('accounts').update({ tokens: null });
}

export async function down(db: Knex): Promise<void> {
  await db.schema.alterTable('accounts', (table) => {
    table.jsonb('tokens').notNullable().alter();
    table.jsonb('profile').notNullable().alter();
  });
}
