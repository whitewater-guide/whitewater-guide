import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import Icon from '../../../../components/Icon';
import { NAVIGATE_BUTTON_HEIGHT, NAVIGATE_BUTTON_WIDTH } from '../../../../components/NavigateButton';
import theme from '../../../../theme';

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
  },
});

interface Props {
  sectionId: string;
  favorite?: boolean | null;
  scale: SharedValue<number>;
  onToggle?: () => void;
}

function FavoriteButton({ favorite, scale, onToggle }: Props) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable style={styles.button} onPress={onToggle}>
        <Icon
          icon={favorite ? 'heart' : 'heart-outline'}
          size={28}
          color={theme.colors.textLight}
        />
      </Pressable>
    </Animated.View>
  );
}

export default memo(FavoriteButton);
