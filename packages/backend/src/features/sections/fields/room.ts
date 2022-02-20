import { Visibility } from 'matrix-js-sdk/lib/@types/partials';

import { SectionResolvers } from '~/apollo';
import config from '~/config';
import { db, Sql } from '~/db';
import { matrixClient } from '~/features/chats';
import log from '~/log';

const roomResolver: SectionResolvers['room'] = async (section) => {
  const { id, room_id, river_name, name } = section;
  const alias = `#${id}:${config.SYNAPSE_HOME_SERVER}`;
  const sectionName = [river_name, name].filter((s) => !!s).join(' - ');

  if (room_id) {
    return { id: `!${room_id}:${config.SYNAPSE_HOME_SERVER}`, alias };
  }
  let roomId: string | null = null;
  // Lazily create room if it doesn't exist
  try {
    await matrixClient.loginAsApi();
    const room = await matrixClient.createRoom({
      room_alias_name: id,
      name: sectionName,
      visibility: Visibility.Public,
      creation_content: {
        __typename: 'Section',
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
      .table('sections')
      .update({ room_id: roomId })
      .where({ id })
      .returning<Sql.Sections[]>(['id', 'room_id']);
    roomId = `!${resp[0].room_id}:${config.SYNAPSE_HOME_SERVER}`;
    log.debug({ room, resp }, 'created section room');
  } catch (e) {
    log.error({ error: e as Error, message: 'section room creation error' });
  } finally {
    await matrixClient.logout();
  }
  return roomId ? { id: roomId, alias } : null;
};

export default roomResolver;
