import { useAuth } from '@whitewater-guide/clients';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import Icon from '~/components/Icon';
import theme from '~/theme';

import useToggleFavoriteRegion from './useToggleFavoriteRegion';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: 40,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
  },
  togglingContainer: {
    paddingTop: theme.margin.single,
  },
  icon: {
    ...theme.shadow,
  },
  iconDisabled: {
    opacity: 0.65,
  },
});

interface Props {
  regionId: string;
  favorite?: boolean | null;
}

const FavoriteButton = memo<Props>(({ regionId, favorite }) => {
  const { me } = useAuth();
  const [toggleFavorite, toggling] = useToggleFavoriteRegion(
    regionId,
    favorite,
  );

  if (!me) {
    return null;
  }

  return (
    <Icon
      icon={favorite ? 'heart' : 'heart-outline'}
      accessibilityLabel="favorite"
      style={[styles.container, styles.iconContainer]}
      iconStyle={[styles.icon, toggling && styles.iconDisabled]}
      color={theme.colors.textLight}
      onPress={toggling ? undefined : toggleFavorite}
    />
  );
});

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
