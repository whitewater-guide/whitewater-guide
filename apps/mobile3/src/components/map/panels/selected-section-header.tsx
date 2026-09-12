import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import DifficultyThumb from '@/components/difficulty-thumb';
import { SimpleStarRating } from '@/components/star-rating/simple-star-rating';
import { ThemedText } from '@/components/themed-text';
import { NAVIGATE_BUTTON_HEIGHT } from '@/components/navigate-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from 'react-i18next';

import type { MapSection } from '../types';

export interface SelectedSectionHeaderProps {
  section: MapSection | null;
}

function SelectedSectionHeader({ section }: SelectedSectionHeaderProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const sectionName = section?.name ?? '';
  const riverName = section?.river?.name ?? '';

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.backgroundElement,
          borderBottomColor: theme.backgroundSelected,
        },
      ]}
    >
      <View style={styles.body}>
        <ThemedText type="small" numberOfLines={1}>
          {riverName}
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={1}>
          {sectionName}
        </ThemedText>
        <View style={styles.row}>
          <SimpleStarRating value={section?.rating} style={styles.stars} />
          {section?.verified === false && (
            <View
              style={[
                styles.unverified,
                { borderColor: theme.textSecondary },
              ]}
            >
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.unverifiedText}
              >
                {t('commons:unverified')}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
      <DifficultyThumb
        difficulty={section?.difficulty ?? 1}
        difficultyXtra={section?.difficultyXtra ?? ' '}
        noBorder
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    flex: 1,
  },
  body: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    width: 80,
    paddingTop: 2,
  },
  unverified: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    padding: 2,
    marginLeft: Spacing.one,
  },
  unverifiedText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});

export default memo(SelectedSectionHeader);
