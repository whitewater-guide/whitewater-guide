import Knex from 'knex';
import { Visibility } from 'matrix-js-sdk/lib/@types/partials';

import config from '~/config';
import { createViews, dropViews, Sql } from '~/db';
import { matrixClient, synapseClient } from '~/features/chats';
import log from '~/log';

const VIEWS = ['sections', 'rivers', 'regions'];

/**
 * This migration adds initial support for synapse chats
 */
export const up = async (db: Knex) => {
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
};

export const down = async (db: Knex) => {
  await dropViews(db, ...VIEWS);
  await db.schema.table('sections', (table) => {
    table.dropColumn('room_id');
  });
  await db.schema.table('regions', (table) => {
    table.dropColumn('room_id');
  });
  await createViews(db, 42, ...VIEWS);
};

export const configuration = { transaction: true };
