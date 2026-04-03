import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@whitewater-guide/clients';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import Icon from '../../../../components/Icon';
import {
  NAVIGATE_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_WIDTH,
} from '../../../../components/NavigateButton';
import { Screens } from '../../../../core/navigation';
import theme from '../../../../theme';
import { useToggleFavoriteSection } from './useToggleFavoriteSection';

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
  },
  toggling: {
    opacity: 0.65,
  },
});

interface Props {
  sectionId: string;
  favorite?: boolean | null;
  scale: SharedValue<number>;
  onToggle?: () => void;
}

function FavoriteButton({ sectionId, favorite, scale, onToggle }: Props) {
  const { me } = useAuth();
  const navigation = useNavigation();
  const [toggleFavorite, toggling] = useToggleFavoriteSection(
    sectionId,
    favorite,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(async () => {
    onToggle?.();
    if (me) {
      await toggleFavorite();
    } else {
      navigation.navigate(Screens.AUTH_MAIN as never);
    }
  }, [me, navigation, onToggle, toggleFavorite]);

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={[styles.button, toggling && styles.toggling]}
        onPress={toggling ? undefined : handlePress}
      >
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
