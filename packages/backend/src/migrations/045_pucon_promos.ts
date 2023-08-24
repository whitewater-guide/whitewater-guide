import Knex from 'knex';

/**
 * This patch adds sequence to generate promocodes for Pucon Kayak Retreat
 */
export const up = async (db: Knex) => {
  await db.raw(`CREATE SEQUENCE IF NOT EXISTS pucon_promo INCREMENT 1 START 1`);
};

export const down = async (db: Knex) => {
  await db.raw(`DROP SEQUENCE IF EXISTS pucon_promo`);
};

export const configuration = { transaction: true };
