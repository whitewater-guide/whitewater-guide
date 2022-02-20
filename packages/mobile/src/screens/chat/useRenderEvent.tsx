import { EventType, MatrixEvent } from 'matrix-js-sdk';
import React, { useCallback } from 'react';
import { ListRenderItemInfo } from 'react-native';

import RoomStart from './RoomStart';
import TextMessage from './TextMessage';
import useMessageActionsheet from './useMessageActionsheet';

export default function useRenderEvent(timelineSize: number) {
  const showMessageActionsheet = useMessageActionsheet();

  return useCallback(
    ({ item }: ListRenderItemInfo<MatrixEvent>) => {
      const type = item.getType();

      switch (type) {
        case EventType.RoomCreate:
          return <RoomStart isEmpty={timelineSize === 1} />;
        case EventType.RoomMessage:
          return (
            <TextMessage message={item} onLongPress={showMessageActionsheet} />
          );
        default:
          return null;
      }
    },
    [timelineSize, showMessageActionsheet],
  );
}
