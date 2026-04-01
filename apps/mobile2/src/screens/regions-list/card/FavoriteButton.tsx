import React, { memo } from 'react';
import { StyleSheet } from 'react-native';

import Icon from '../../../components/Icon';
import { useAuth } from '../../../core/auth';
import theme from '../../../theme';
import useToggleFavoriteRegion from './useToggleFavoriteRegion';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: theme.margin.single + 40,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: theme.margin.half,
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

function FavoriteButton({ regionId, favorite }: Props) {
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
}

export default memo(FavoriteButton);
