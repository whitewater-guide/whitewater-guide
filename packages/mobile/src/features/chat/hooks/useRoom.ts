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
 * @param roomId Full internal room id (starts with exclamation marks and contains :domain)
 * @returns
 */
export function useRoom(roomId: string) {
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

    client.joinRoom(roomId).then((room) => {
      set(getRenderableTimeline(room));
    });

    return () => {
      client.off('Room.timeline', onTimelineEvent);
      client.leave(roomId);
    };
  }, [client, set, insertAt, roomId]);

  const [{ loading }, loadOlder] = useAsyncFn(async () => {
    const room = client.getRoom(roomId);
    const liveTimeline = room?.getLiveTimeline();
    if (liveTimeline) {
      await client.paginateEventTimeline(liveTimeline, {
        backwards: true,
        limit: 40,
      });
      set(getRenderableTimeline(room));
    }
  }, [client, roomId, set]);

  return { timeline, loading, loadOlder };
}
