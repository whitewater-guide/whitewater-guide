import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth';

const ICON_SHADOW = {
  textShadowColor: '#000000',
  textShadowOffset: { width: 0.75, height: 0.75 },
  textShadowRadius: 1.5,
};

export interface RegionFavoriteButtonProps {
  regionId: string;
  favorite?: boolean | null;
}

function FavoriteButton({ favorite }: RegionFavoriteButtonProps) {
  const { me } = useAuth();

  if (!me) {
    return null;
  }

  return (
    <Icon
      icon={favorite ? 'heart' : 'heart-outline'}
      accessibilityLabel="favorite"
      style={[styles.container, styles.iconContainer]}
      iconStyle={styles.icon}
      color="#ffffff"
      onPress={() => {
        /* Storybook mock: favorite mutation is not wired yet */
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'flex-start',
    top: 0,
    right: Spacing.two + 40,
    width: 48,
    height: 40,
  },
  iconContainer: {
    paddingTop: Spacing.one,
  },
  icon: ICON_SHADOW,
});

export default memo(FavoriteButton);
