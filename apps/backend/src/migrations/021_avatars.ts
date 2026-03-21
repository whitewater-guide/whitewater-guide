import type { Knex } from 'knex';

/**
 * This patch nullifies all existing avatars
 * None were uploaded, and facebook links do expire
 */
export async function up(db: Knex): Promise<void> {
  await db.table('users').update({ avatar: null });
}

export const down = async () => {
  // do nothing
};
