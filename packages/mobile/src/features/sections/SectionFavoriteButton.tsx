import { useNavigation } from '@react-navigation/native';
import { sleep, useAuth } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import useAsyncFn from 'react-use/lib/useAsyncFn';

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
});

interface Props {
  color?: string;
  sectionId: string;
  favorite?: boolean | null;
  onToggle?: () => void;
}

export const SectionFavoriteButton = memo<Props>((props) => {
  const {
    sectionId,
    favorite,
    onToggle,
    color = theme.colors.textMain,
  } = props;

  const { me } = useAuth();
  const [toggleFavorite, toggling] = useToggleFavoriteSection(
    sectionId,
    favorite,
  );
  const { navigate } = useNavigation();

  const [_, handleFavorite] = useAsyncFn(async () => {
    // Close row first. If we don't do this now, then due to larglist workings we can end up wiih wrong open row
    onToggle?.();
    if (me) {
      // Give it some time to collapse
      await sleep(200);
      await toggleFavorite();
    } else {
      navigate(Screens.AUTH_STACK);
    }
  }, [toggleFavorite, me, navigate, onToggle]);

  return (
    <Icon
      icon={favorite ? 'heart' : 'heart-outline'}
      accessibilityLabel="favorite"
      style={[styles.container, styles.iconContainer]}
      iconStyle={toggling && styles.iconDisabled}
      color={color}
      onPress={toggling ? undefined : handleFavorite}
    />
  );
});

SectionFavoriteButton.displayName = 'SectionFavoriteButton';
