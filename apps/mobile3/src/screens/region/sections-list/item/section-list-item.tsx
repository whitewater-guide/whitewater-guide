import { memo, useCallback, useEffect, useRef, type RefObject } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type {
  SwipeableMethods,
  SwipeableProps,
} from 'react-native-gesture-handler/ReanimatedSwipeable';

import { NAVIGATE_BUTTON_WIDTH } from '@/components/navigate-button';
import { useSwipeableList } from '@/components/swipeable-list-provider';

import SectionListItemView from './section-list-item-view';
import SectionUnderlay from './section-underlay';
import type { ListedSection } from './types';

export interface SectionListItemProps {
  section: ListedSection;
  onPress: (section: ListedSection) => void;
  ref?: RefObject<SwipeableMethods | null>;
}

function SectionListItem({ section, onPress, ref }: SectionListItemProps) {
  const internalRef = useRef<SwipeableMethods | null>(null);
  const swipeRef = ref ?? internalRef;
  const { activeRef } = useSwipeableList();

  useEffect(() => {
    swipeRef.current?.close();
  }, [section.id, swipeRef]);

  const handlePress = useCallback(() => {
    onPress(section);
  }, [onPress, section]);

  const renderRightActions = useCallback<
    NonNullable<SwipeableProps['renderRightActions']>
  >(
    (_progress: SharedValue<number>, drag: SharedValue<number>) => (
      <SectionUnderlay section={section} position={drag} />
    ),
    [section],
  );

  const handleSwipeableWillOpen = useCallback(() => {
    if (activeRef.current && activeRef.current !== swipeRef.current) {
      activeRef.current.close();
    }
    activeRef.current = swipeRef.current;
  }, [activeRef, swipeRef]);

  const handleSwipeableClose = useCallback(() => {
    if (activeRef.current === swipeRef.current) {
      activeRef.current = null;
    }
  }, [activeRef, swipeRef]);

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      rightThreshold={NAVIGATE_BUTTON_WIDTH}
      friction={2}
      overshootRight={false}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      onSwipeableClose={handleSwipeableClose}
    >
      <SectionListItemView section={section} onPress={handlePress} />
    </ReanimatedSwipeable>
  );
}

export default memo(SectionListItem);
