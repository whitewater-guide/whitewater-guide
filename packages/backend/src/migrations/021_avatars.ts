import Knex from 'knex';

/**
 * This patch nullifies all existing avatars
 * None were uploaded, and facebook links do expire
 */
export const up = async (db: Knex) => {
  await db.table('users').update({ avatar: null });
};

export const down = async () => {};

export const configuration = { transaction: true };
