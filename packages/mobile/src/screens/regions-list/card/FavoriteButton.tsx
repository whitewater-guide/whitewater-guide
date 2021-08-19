import { useAuth } from '@whitewater-guide/clients';
import { Region } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import Icon from '~/components/Icon';
import theme from '~/theme';

import { useToggleFavoriteRegionMutation } from './toggleFavoriteRegion.generated';

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
  loadingContainer: {
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
  region: Pick<Region, 'id' | 'favorite'>;
}

const FavoriteButton: React.FC<Props> = ({ region }) => {
  const { id, favorite } = region;
  const { me } = useAuth();
  const [mutate, { loading }] = useToggleFavoriteRegionMutation();

  const handleFavorite = useCallback(() => {
    mutate({ variables: { id, favorite: !favorite } }).catch(() => {});
  }, [mutate, id, favorite]);

  if (!me) {
    return null;
  }

  return (
    <Icon
      icon={favorite ? 'heart' : 'heart-outline'}
      accessibilityLabel="favorite"
      style={[styles.container, styles.iconContainer]}
      iconStyle={[styles.icon, loading && styles.iconDisabled]}
      color={theme.colors.textLight}
      onPress={loading ? undefined : handleFavorite}
    />
  );
};

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
