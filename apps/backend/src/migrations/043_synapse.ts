import type { Knex } from 'knex';
import { Visibility } from 'matrix-js-sdk';

import config from '../config';
import type { Sql } from '../db/index';
import { createViews, dropViews } from '../db/index';
import { matrixClient, synapseClient } from '../features/chats/index';
import log from '../log/index';

const VIEWS = ['sections', 'rivers', 'regions'];

/**
 * This migration adds initial support for synapse chats
 */
export async function up(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.text('room_id').nullable();
  });
  await db.schema.table('regions', (table) => {
    table.text('room_id').nullable();
  });
  await createViews(db, 43, ...VIEWS);

  // Create system users
  try {
    // Admin (acces via UI)
    await synapseClient.registerUser(
      config.SYNAPSE_ADMIN_USER,
      config.SYNAPSE_ADMIN_PASSWORD,
    );
    // API (programatic backend access)
    await synapseClient.registerUser(config.SYNAPSE_API_USER);
    // Find all 'admin' users from database, register them with admin privilegies
    const admins: Sql.Users[] = await db
      .table('users')
      .select()
      .where({ admin: true });
    for (let admin of admins) {
      // use random password. these users should log in with jwt token
      await synapseClient.registerUser(admin.id);
    }
  } catch (e) {
    log.error({ error: e as Error, message: 'admin creation error' });
  }
  // Create some system rooms
  try {
    await matrixClient.loginAsApi();
    const room = await matrixClient.createRoom({
      room_alias_name: 'lobby',
      name: 'Whitewater.guide global chat',
      visibility: Visibility.Public,
    });
    log.debug({ room }, 'created lobby');
    await matrixClient.logout();
  } catch (e) {
    log.error({ error: e as Error, message: 'lobby creation error' });
  }
}

export async function down(db: Knex): Promise<void> {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.dropColumn('room_id');
  });
  await db.schema.table('regions', (table) => {
    table.dropColumn('room_id');
  });
  await createViews(db, 42, ...VIEWS);
}
