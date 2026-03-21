import type { MatrixEvent } from 'matrix-js-sdk';
import type { RefObject } from 'react';
import { useCallback, useEffect, useRef } from 'react';
import type {
  FlatList,
  FlatListProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

/**
 * This hook makes list scroll to bottom when new message is added and the list is almost at the bottom already
 * @param listRef
 * @param timeline
 * @returns
 */
export function useScrollOnLiveEvent(
  listRef: RefObject<FlatList<MatrixEvent>>,
  timeline: MatrixEvent[],
): Partial<FlatListProps<MatrixEvent>> {
  const scrollYRef = useRef(0);
  const newestEventId = timeline[0]?.getId();

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollYRef.current = e.nativeEvent.contentOffset.y;
    },
    [scrollYRef],
  );

  useEffect(() => {
    if (scrollYRef.current < 50) {
      listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [newestEventId, scrollYRef, listRef]);

  return { onMomentumScrollEnd: onScrollEnd, onScrollEndDrag: onScrollEnd };
}
