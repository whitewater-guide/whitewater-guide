import Knex from 'knex';

/**
 * This patch adds on delete cascade to sections_edit_log
 */
export const up = async (db: Knex) => {
  return db.schema.alterTable('sections_edit_log', (table) => {
    table.dropForeign(['editor_id']);

    table.foreign('editor_id').references('users.id').onDelete('CASCADE');
  });
};

export const down = async (db: Knex) => {
  return db.schema.alterTable('sections_edit_log', (table) => {
    table.dropForeign(['editor_id']);

    table.foreign('editor_id').references('users.id').onDelete('NO ACTION');
  });
};

export const configuration = { transaction: true };
