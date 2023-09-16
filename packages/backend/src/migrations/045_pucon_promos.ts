import type { Knex } from 'knex';

/**
 * This patch adds sequence to generate promocodes for Pucon Kayak Retreat
 */
export async function up(db: Knex): Promise<void> {
  await db.raw(`CREATE SEQUENCE IF NOT EXISTS pucon_promo INCREMENT 1 START 1`);
}

export async function down(db: Knex): Promise<void> {
  await db.raw(`DROP SEQUENCE IF EXISTS pucon_promo`);
}
