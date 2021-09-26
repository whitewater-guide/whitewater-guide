import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

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
  scale: Animated.Node<number>;
  onToggle?: (swipeId: string) => void;
}

const FavoriteButton = memo<Props>((props) => {
  const { scale, ...rest } = props;

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] } as any]}>
      <SectionFavoriteButton {...rest} />
    </Animated.View>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
