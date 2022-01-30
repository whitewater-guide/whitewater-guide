import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useEffect } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useList from 'react-use/lib/useList';

import { useChatClient } from '../ChatClientProvider';
import { IRoomTimelineData } from '../types';

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
      insertAt(0, e);
    };

    client.on('Room.timeline', onTimelineEvent);

    client.joinRoom(roomId).then((room) => {
      const events = [...room.getLiveTimeline().getEvents()].reverse();
      set(events);
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
      const events = [...liveTimeline.getEvents()];
      set(events.reverse());
    }
  }, [client, roomId, set]);

  return { timeline, loading, loadOlder };
}
