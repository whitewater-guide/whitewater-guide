import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import DifficultyThumb from '@/components/difficulty-thumb';
import FlowsThumb from '@/components/flows-thumb';
import { SimpleStarRating } from '@/components/star-rating/simple-star-rating';
import { ThemedText } from '@/components/themed-text';
import UnverifiedBadge from '@/components/unverified-badge';
import { useTheme } from '@/hooks/use-theme';

import { ITEM_HEIGHT } from './constants';
import type { ListedSection } from './types';

export interface SectionListItemViewProps {
  section: ListedSection;
  onPress?: () => void;
}

function SectionListItemView({ section, onPress }: SectionListItemViewProps) {
  const theme = useTheme();
  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          borderColor: theme.backgroundSelected,
        },
      ]}
      onPress={onPress}
    >
      <DifficultyThumb
        difficulty={section.difficulty}
        difficultyXtra={section.difficultyXtra}
      />

      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {section.river.name}
        </ThemedText>

        <ThemedText type="small" numberOfLines={1}>
          {section.name}
        </ThemedText>

        <View style={styles.row}>
          <SimpleStarRating
            value={section.rating}
            style={styles.starsContainer}
          />
          {section.verified === false && <UnverifiedBadge />}
        </View>
      </View>

      <FlowsThumb section={section} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
  },
  starsContainer: {
    width: 80,
    paddingTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default memo(SectionListItemView);
