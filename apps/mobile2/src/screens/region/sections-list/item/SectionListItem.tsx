import type {
  ListedSectionFragment,
  SectionDerivedFields,
} from '@whitewater-guide/clients';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableProps, SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';

import { NAVIGATE_BUTTON_WIDTH } from '../../../../components/NavigateButton';
import { useSwipeableList } from '../../../../components/SwipeableListProvider';
import SectionListItemView from './SectionListItemView';
import SectionUnderlay from './SectionUnderlay';

type Section = ListedSectionFragment & SectionDerivedFields;

interface Props {
  section: Section;
  onPress: (section: Section) => void;
}

function SectionListItem({ section, onPress }: Props) {
  const swipeRef = useRef<SwipeableMethods | null>(null);
  const { activeRef } = useSwipeableList();

  // Reset swipe state when FlashList recycles this view for a different item
  useEffect(() => {
    swipeRef.current?.close();
  }, [section.id]);

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
  }, [activeRef]);

  const handleSwipeableClose = useCallback(() => {
    if (activeRef.current === swipeRef.current) {
      activeRef.current = null;
    }
  }, [activeRef]);

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
