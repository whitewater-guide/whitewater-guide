import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { NAVIGATE_BUTTON_HEIGHT } from '~/components/NavigateButton';
import { useSwipeableList } from '~/components/swipeable';
import { useAppSettings } from '~/features/settings';

export const SWIPEABLE_SECTION_TIP_BUTTON_WIDTH = 100;

const styles = StyleSheet.create({
  container: {
    width: SWIPEABLE_SECTION_TIP_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: 'red',
  },
});

interface Props {
  position: SharedValue<number>;
}

export const SwipeableSectionTipButton = memo<Props>(({ position }) => {
  const { t } = useTranslation();
  const { updateSettings } = useAppSettings();
  const [_, close] = useSwipeableList();

  const onClose = useCallback(() => {
    close();
    // update after closing animation
    setTimeout(() => {
      updateSettings({ seenSwipeableSectionTip: true });
    }, 250);
  }, [close, updateSettings]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      position.value,
      [-SWIPEABLE_SECTION_TIP_BUTTON_WIDTH, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <RectButton onPress={onClose}>
        <Text>{t('commons:close')}</Text>
      </RectButton>
    </Animated.View>
  );
});

SwipeableSectionTipButton.displayName = 'SwipeableSectionTipButton';
