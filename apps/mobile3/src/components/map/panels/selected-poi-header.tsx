import type { PointCoreFragment } from '@whitewater-guide/schema';
import { POINames } from '@whitewater-guide/schema';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { NAVIGATE_BUTTON_HEIGHT } from '@/components/navigate-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface SelectedPOIHeaderProps {
  poi?: PointCoreFragment | null;
}

export const SelectedPOIHeader = memo(({ poi }: SelectedPOIHeaderProps) => {
  const theme = useTheme();
  const kind = poi?.kind ?? 'other';
  const kindLabel =
    kind in POINames ? POINames[kind as keyof typeof POINames] : kind;
  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.backgroundElement,
          borderBottomColor: theme.backgroundSelected,
        },
      ]}
    >
      <View style={styles.header}>
        <ThemedText type="small">{poi?.name ?? ' '}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {kindLabel}
        </ThemedText>
      </View>
    </View>
  );
});

SelectedPOIHeader.displayName = 'SelectedPOIHeader';

export default SelectedPOIHeader;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: NAVIGATE_BUTTON_HEIGHT,
    flex: 1,
  },
  header: {
    flex: 1,
    padding: Spacing.two,
  },
});
