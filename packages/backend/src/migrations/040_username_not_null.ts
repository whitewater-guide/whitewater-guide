import Knex from 'knex';

/**
 * For some reason, user.name field was nullable
 * But in actual data it's not
 * @param {Knex} db
 * @returns {Promise<void>}
 */
export const up = async (db: Knex) => {
  await db.schema.alterTable('users', (table) => {
    table.string('name').notNullable().alter();
  });
};

export const down = async (db: Knex) => {
  await db.schema.alterTable('users', (table) => {
    table.string('name').nullable().alter();
  });
};

export const configuration = { transaction: true };
