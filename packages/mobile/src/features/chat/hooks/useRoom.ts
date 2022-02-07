import { Room as TRoom } from '@whitewater-guide/schema';
import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useEffect } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useList from 'react-use/lib/useList';

import { useChatClient } from '../ChatClientProvider';
import { IRoomTimelineData } from '../types';
import { isEventRenderable } from '../utils';

function getRenderableTimeline(room: Room): MatrixEvent[] {
  const result: MatrixEvent[] = [];

  room
    .getLiveTimeline()
    .getEvents()
    .forEach((e) => {
      if (isEventRenderable(e)) {
        result.unshift(e);
      }
    });

  return result;
}

/**
 * This hook makes user join the room and returns timeline and pagination
 * @param room as returned by graphql
 * @returns
 */
export function useRoom({ id: roomId, alias }: TRoom) {
  const { client } = useChatClient();
  const [timeline, { insertAt, set }] = useList<MatrixEvent>([]);

  useEffect(() => {
    const onTimelineEvent = (
      e: MatrixEvent,
      room: Room,
      _toStartOfTimeline: boolean,
      _remove: boolean,
      data: IRoomTimelineData,
    ) => {
      if (room.roomId !== roomId) {
        return;
      }
      if (!data.liveEvent) {
        return;
      }
      if (!isEventRenderable(e)) {
        return;
      }
      insertAt(0, e);
    };

    client.on('Room.timeline', onTimelineEvent);

    // synapse does not allow joining by room id, we have to use alias
    client.joinRoom(alias).then((_room) => {
      // at this point _room is not fully synced, so we wait for sync event
      const onSync = (state: string) => {
        const room = client.getRoom(roomId);
        if (state === 'SYNCING' && room) {
          set(getRenderableTimeline(room));
          client.off('sync', onSync);
        }
      };
      client.on('sync', onSync);
    });

    return () => {
      client.off('Room.timeline', onTimelineEvent);
      client.leave(roomId);
    };
  }, [client, set, insertAt, roomId, alias]);

  const [{ loading }, loadOlder] = useAsyncFn(async () => {
    const room = client.getRoom(roomId);
    const liveTimeline = room?.getLiveTimeline();
    if (liveTimeline) {
      await client.scrollback(room, 40);
      set(getRenderableTimeline(room));
    }
  }, [client, roomId, set]);

  return { timeline, loading, loadOlder };
}
