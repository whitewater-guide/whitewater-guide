import { Visibility } from 'matrix-js-sdk/lib/@types/partials';

import { SectionResolvers } from '~/apollo';
import config from '~/config';
import { db } from '~/db';
import { matrixClient } from '~/features/chats';
import log from '~/log';

const roomIdResolver: SectionResolvers['roomId'] = async (section) => {
  const { id, room_id, river_name, name } = section;
  const sectionName = [river_name, name].filter((s) => !!s).join(' - ');

  if (room_id) {
    return `!${room_id}:${config.SYNAPSE_HOME_SERVER}`;
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
    });
    // this returns smth like !gzbjXAxsDGrMsbigGF:whitewater.guide
    // we only want actual id part
    roomId = room.room_id.split(':')[0].slice(1);
    roomId = `!${roomId}:${config.SYNAPSE_HOME_SERVER}`;
    await db().table('sections').update({ room_id: roomId }).where({ id });
    log.debug({ room }, 'created section room');
  } catch (e) {
    log.error({ error: e as Error, message: 'section room creation error' });
  } finally {
    await matrixClient.logout();
  }
  return roomId;
};

export default roomIdResolver;
