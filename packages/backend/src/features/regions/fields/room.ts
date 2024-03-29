import { Visibility } from 'matrix-js-sdk';

import type { RegionResolvers } from '../../../apollo/index';
import config from '../../../config';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';
import { matrixClient } from '../../../features/chats/index';
import log from '../../../log/index';

const roomResolver: RegionResolvers['room'] = async ({ id, name, room_id }) => {
  const alias = `#${id}:${config.SYNAPSE_HOME_SERVER}`;
  if (room_id) {
    return {
      id: `!${room_id}:${config.SYNAPSE_HOME_SERVER}`,
      alias,
    };
  }
  let roomId: string | null = null;
  // Lazily create room if it doesn't exist
  try {
    await matrixClient.loginAsApi();
    const room = await matrixClient.createRoom({
      room_alias_name: id,
      name,
      visibility: Visibility.Public,
      creation_content: {
        __typename: 'Region',
      },
      power_level_content_override: {
        users: {
          [`@${config.SYNAPSE_API_USER}:${config.SYNAPSE_HOME_SERVER}`]: 100,
          [`@${config.SYNAPSE_ADMIN_USER}:${config.SYNAPSE_HOME_SERVER}`]: 100,
        },
      },
    });
    // this returns smth like !gzbjXAxsDGrMsbigGF:whitewater.guide
    // we only want actual id part
    roomId = room.room_id.split(':')[0].slice(1);
    const resp = await db()
      .table('regions')
      .update({ room_id: roomId })
      .where({ id })
      .returning<Sql.Regions[]>(['id', 'room_id']);
    roomId = `!${resp[0].room_id}:${config.SYNAPSE_HOME_SERVER}`;
    log.debug({ room, resp }, 'created region room');
  } catch (e) {
    log.error({ error: e as Error, message: 'region room creation error' });
  } finally {
    await matrixClient.logout();
  }
  return roomId ? { id: roomId, alias } : null;
};

export default roomResolver;
