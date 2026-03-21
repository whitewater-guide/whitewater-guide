import type { FC } from 'react';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useSwipeableList } from '~/components/swipeable';
import { SectionFavoriteButton } from '~/features/sections';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  sectionId: string;
  favorite?: boolean | null;
  scale: SharedValue<number>;
}

const FavoriteButton: FC<Props> = (props) => {
  const { scale, ...rest } = props;

  const [_, close] = useSwipeableList();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <SectionFavoriteButton {...rest} onToggle={close} />
    </Animated.View>
  );
};

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
