import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import {
  NAVIGATE_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_WIDTH,
} from '@/components/navigate-button';
import { useAuth } from '@/features/auth';

const ACCENT = '#FF9900';

export interface SectionFavoriteButtonProps {
  sectionId: string;
  favorite?: boolean | null;
  scale: SharedValue<number>;
}

function FavoriteButton({
  favorite,
  scale,
}: SectionFavoriteButtonProps) {
  const { me } = useAuth();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.button, { backgroundColor: ACCENT }]}
        onPress={() => {
          if (!me) {
            return;
          }
        }}
      >
        <Icon
          icon={favorite ? 'heart' : 'heart-outline'}
          size={28}
          color="#ffffff"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(FavoriteButton);
