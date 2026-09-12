import { Durations } from '@whitewater-guide/schema';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/icon';
import { ThemedText } from '@/components/themed-text';
import { NAVIGATE_BUTTON_WIDTH } from '@/components/navigate-button';
import { RowHeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import type { MapSection } from '../types';
import SectionFlowsRow from './section-flows-row';

export interface SelectedSectionTableProps {
  section: MapSection | null;
}

function propsAreEqual(
  a: SelectedSectionTableProps,
  b: SelectedSectionTableProps,
): boolean {
  return a.section?.id === b.section?.id;
}

const SelectedSectionTable = memo(({ section }: SelectedSectionTableProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const season = section?.season?.trim() || ' ';
  const duration = section?.duration
    ? (Durations.get(section.duration) ?? t('commons:unknown'))
    : t('commons:unknown');
  const drop = section?.drop;
  const distance = section?.distance;
  const border = { borderColor: theme.backgroundSelected };
  const iconColor = theme.text;

  return (
    <View style={{ backgroundColor: theme.backgroundElement }}>
      <View style={[styles.row1, border]}>
        <View style={[styles.col, styles.col1, border]}>
          <Icon icon="map-marker-distance" color={iconColor} size={24} />
          <ThemedText type="small" style={styles.colText} numberOfLines={1}>
            {distance ? `${distance} ${t('commons:km')}` : t('commons:unknown')}
          </ThemedText>
        </View>
        <View style={[styles.col, styles.col2]}>
          <Icon icon="arrow-expand-vertical" color={iconColor} size={24} />
          <ThemedText type="small" style={styles.colText} numberOfLines={1}>
            {drop ? `${drop} ${t('commons:m')}` : t('commons:unknown')}
          </ThemedText>
        </View>
        <View style={[styles.col, styles.col3, border]}>
          <Icon icon="clock" color={iconColor} size={24} />
          <ThemedText type="small" style={styles.colText} numberOfLines={1}>
            {duration}
          </ThemedText>
        </View>
      </View>

      <SectionFlowsRow section={section} />

      <View style={[styles.row3, { paddingHorizontal: Spacing.two }]}>
        <ThemedText type="smallBold">{t('commons:season')}</ThemedText>
        <ThemedText type="small" numberOfLines={1}>
          {season}
        </ThemedText>
      </View>
    </View>
  );
}, propsAreEqual);

SelectedSectionTable.displayName = 'SelectedSectionTable';

export default SelectedSectionTable;

const styles = StyleSheet.create({
  col: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    flex: 1,
    height: RowHeight,
  },
  col1: {
    paddingRight: Spacing.one,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  col2: {
    paddingHorizontal: Spacing.one,
  },
  col3: {
    paddingLeft: Spacing.one,
    borderLeftWidth: StyleSheet.hairlineWidth,
    width: 2 * NAVIGATE_BUTTON_WIDTH - Spacing.two,
    flex: undefined,
  },
  colText: {
    flex: 1,
    textAlign: 'right',
  },
  row1: {
    flexDirection: 'row',
    height: RowHeight,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row3: {
    flexDirection: 'row',
    height: RowHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
