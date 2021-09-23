import { useNavigation } from '@react-navigation/native';
import { sleep, useAuth } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAsyncFn } from 'react-use';

import Icon from '~/components/Icon';
import {
  NAVIGATE_BUTTON_HEIGHT,
  NAVIGATE_BUTTON_WIDTH,
} from '~/components/NavigateButton';
import { Screens } from '~/core/navigation';
import theme from '~/theme';

import useToggleFavoriteSection from './useToggleFavoriteSection';

const styles = StyleSheet.create({
  container: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  togglingContainer: {
    paddingTop: theme.margin.single,
  },
  iconDisabled: {
    opacity: 0.65,
  },
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
  const { sectionId, favorite, scale, onToggle } = props;

  const { me } = useAuth();
  const [toggleFavorite, toggling] = useToggleFavoriteSection(
    sectionId,
    favorite,
  );
  const { navigate } = useNavigation();

  const [_, handleFavorite] = useAsyncFn(async () => {
    // Close row first. If we don't do this now, then due to larglist workings we can end up wiih wrong open row
    onToggle?.('');
    if (me) {
      // Give it some time to collapse
      await sleep(200);
      await toggleFavorite();
    } else {
      navigate(Screens.AUTH_STACK);
    }
  }, [toggleFavorite, me, navigate, onToggle]);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] } as any]}>
      <Icon
        icon={favorite ? 'heart' : 'heart-outline'}
        accessibilityLabel="favorite"
        style={[styles.container, styles.iconContainer]}
        iconStyle={toggling && styles.iconDisabled}
        color={theme.colors.textMain}
        onPress={toggling ? undefined : handleFavorite}
      />
    </Animated.View>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
