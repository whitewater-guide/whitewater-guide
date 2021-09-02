import { useNavigation } from '@react-navigation/native';
import { sleep, useAuth } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/schema';
import React from 'react';
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

import { useToggleFavoriteSectionMutation } from './toggleFavoriteSection.generated';

const styles = StyleSheet.create({
  container: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  loadingContainer: {
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
  section: Pick<Section, 'id' | 'favorite'>;
  scale: Animated.Node<number>;
  onToggle?: (swipeId: string) => void;
}

const FavoriteButton: React.FC<Props> = ({ section, scale, onToggle }) => {
  const { id, favorite } = section;

  const { me } = useAuth();
  const [mutate, { loading }] = useToggleFavoriteSectionMutation();
  const { navigate } = useNavigation();

  const [_, handleFavorite] = useAsyncFn(async () => {
    // Close row first. If we don't do this now, then due to larglist workings we can end up wiih wrong open row
    onToggle?.('');
    if (me) {
      // Give it some time to collapse
      await sleep(200);
      await mutate({
        variables: { id, favorite: !favorite },
        optimisticResponse: {
          toggleFavoriteSection: {
            __typename: 'Section',
            id,
            favorite: !favorite,
          },
        },
      }).catch(() => {});
    } else {
      navigate(Screens.AUTH_STACK);
    }
  }, [mutate, id, favorite, me, navigate, onToggle]);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] } as any]}>
      <Icon
        icon={favorite ? 'heart' : 'heart-outline'}
        accessibilityLabel="favorite"
        style={[styles.container, styles.iconContainer]}
        iconStyle={loading && styles.iconDisabled}
        color={theme.colors.textMain}
        onPress={loading ? undefined : handleFavorite}
      />
    </Animated.View>
  );
};

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
