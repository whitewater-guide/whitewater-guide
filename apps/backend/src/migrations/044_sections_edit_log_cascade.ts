import type { Knex } from 'knex';

/**
 * This patch adds on delete cascade to sections_edit_log
 */
export async function up(db: Knex): Promise<void> {
  return db.schema.alterTable('sections_edit_log', (table) => {
    table.dropForeign(['editor_id']);

    table.foreign('editor_id').references('users.id').onDelete('CASCADE');
  });
}

export async function down(db: Knex): Promise<void> {
  return db.schema.alterTable('sections_edit_log', (table) => {
    table.dropForeign(['editor_id']);

    table.foreign('editor_id').references('users.id').onDelete('NO ACTION');
  });
}
