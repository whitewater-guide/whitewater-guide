import { useAuth } from '@whitewater-guide/clients';
import { Section } from '@whitewater-guide/schema';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import Icon from '~/components/Icon';
import { NAVIGATE_BUTTON_HEIGHT } from '~/components/NavigateButton';
import theme from '~/theme';

import { useToggleFavoriteSectionMutation } from './toggleFavoriteSection.generated';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: 40,
    width: 60,
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
});

interface Props {
  section: Pick<Section, 'id' | 'favorite'>;
}

const FavoriteButton: React.FC<Props> = ({ section }) => {
  const { id, favorite } = section;
  const { me } = useAuth();
  const [mutate, { loading }] = useToggleFavoriteSectionMutation();

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
      iconStyle={loading && styles.iconDisabled}
      color={theme.colors.textMain}
      onPress={loading ? undefined : handleFavorite}
    />
  );
};

FavoriteButton.displayName = 'FavoriteButton';

export default FavoriteButton;
