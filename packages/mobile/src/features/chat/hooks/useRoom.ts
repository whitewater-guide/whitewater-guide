import { MatrixEvent, Room } from 'matrix-js-sdk';
import { useEffect, useRef } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import useList from 'react-use/lib/useList';

import { IRoomTimelineData } from '~/features/chat/model/types';

import { useChatClient } from '../ChatClientProvider';

export function useRoom(id: string) {
  const alias = `#${id}:whitewater.guide`;
  const roomIdRef = useRef('');
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
      if (room.roomId !== roomIdRef.current) {
        return;
      }
      if (!data.liveEvent) {
        return;
      }
      insertAt(0, e);
    };

    client.on('Room.timeline', onTimelineEvent);

    client.joinRoom(alias).then((room) => {
      roomIdRef.current = room.roomId;
      const events = [...room.getLiveTimeline().getEvents()].reverse();
      set(events);
    });

    return () => {
      client.off('Room.timeline', onTimelineEvent);
      client.leave(roomIdRef.current);
    };
  }, [client, alias, set, insertAt, roomIdRef]);

  const [{ loading }, loadOlder] = useAsyncFn(async () => {
    const room = client.getRoom(roomIdRef.current);
    const liveTimeline = room?.getLiveTimeline();
    if (liveTimeline) {
      await client.paginateEventTimeline(liveTimeline, {
        backwards: true,
        limit: 40,
      });
      const events = [...liveTimeline.getEvents()];
      set(events.reverse());
    }
  }, [client, roomIdRef, set]);

  return { timeline, loading, loadOlder };
}
