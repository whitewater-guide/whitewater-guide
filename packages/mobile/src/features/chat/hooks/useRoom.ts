import { Room as TRoom } from '@whitewater-guide/schema';
import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useEffect } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useList from 'react-use/lib/useList';

import { useChatClient } from '../ChatProvider';
import { MESSAGES_IN_BATCH } from '../constants';
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
  const client = useChatClient();
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
      if (e.isRelation('m.replace')) {
        // This event marks another event as edited
        // TODO: handle edits live
        return;
      }
      insertAt(0, e);
    };

    const onRedaction = (e: MatrixEvent, room: Room) => {
      if (room.roomId !== roomId) {
        return;
      }
      // Just rerender timeline
      set(getRenderableTimeline(room));
    };

    client.on('Room.timeline', onTimelineEvent);
    client.on('Room.redaction', onRedaction);

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
      client.off('Room.redaction', onRedaction);
      client.leave(roomId);
    };
  }, [client, set, insertAt, roomId, alias]);

  const [{ loading }, loadOlder] = useAsyncFn(async () => {
    const room = client.getRoom(roomId);
    const liveTimeline = room?.getLiveTimeline();
    if (liveTimeline) {
      await client.scrollback(room, MESSAGES_IN_BATCH);
      set(getRenderableTimeline(room));
    }
  }, [client, roomId, set]);

  // console.log(JSON.stringify(timeline.map((t) => t.event)));

  return { timeline, loading, loadOlder };
}