import React, { memo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  SwipeableMethods,
  SwipeableProps,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import Icon from '../../../../components/Icon';
import { useSwipeableList } from '../../../../components/SwipeableListProvider';
import { useAppSettings } from '../../../../features/settings';
import theme from '../../../../theme';
import { ITEM_HEIGHT } from './constants';

const TIP_BUTTON_WIDTH = 100;

const styles = StyleSheet.create({
  overlay: {
    width: Dimensions.get('window').width,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.lightBackground,
    paddingHorizontal: theme.margin.single,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  text: {
    color: theme.colors.textMain,
    flex: 1,
  },
  underlay: {
    width: TIP_BUTTON_WIDTH,
    height: ITEM_HEIGHT,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: theme.colors.textLight,
  },
});

interface TipCloseButtonProps {
  position: SharedValue<number>;
  onClose: () => void;
}

function TipCloseButton({ position, onClose }: TipCloseButtonProps) {
  const { t } = useTranslation();

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      position.value,
      [-TIP_BUTTON_WIDTH, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.underlay, animatedStyle]}>
      <Pressable
        onPress={onClose}
        style={StyleSheet.absoluteFill}
        role="button"
      >
        <View style={styles.underlay}>
          <Text style={styles.closeText}>{t('commons:close')}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function SwipeableSectionTip() {
  const { t } = useTranslation();
  const swipeRef = useRef<SwipeableMethods | null>(null);
  const { activeRef } = useSwipeableList();
  const { updateSettings } = useAppSettings();

  const handleClose = useCallback(() => {
    swipeRef.current?.close();
    setTimeout(() => {
      updateSettings({ seenSwipeableSectionTip: true });
    }, 250);
  }, [updateSettings]);

  const renderRightActions = useCallback<
    NonNullable<SwipeableProps['renderRightActions']>
  >(
    (_progress: SharedValue<number>, drag: SharedValue<number>) => (
      <TipCloseButton position={drag} onClose={handleClose} />
    ),
    [handleClose],
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
      rightThreshold={TIP_BUTTON_WIDTH}
      friction={2}
      overshootRight={false}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      onSwipeableClose={handleSwipeableClose}
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>
          {t('screens:region.sectionsList.swipeableTip')}
        </Text>
        <Icon
          icon="chevron-triple-left"
          color={theme.colors.textMain}
          size={16}
        />
      </View>
    </ReanimatedSwipeable>
  );
}

export default memo(SwipeableSectionTip);
