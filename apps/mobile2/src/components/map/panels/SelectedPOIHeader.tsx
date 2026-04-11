import type { PointCoreFragment } from '@whitewater-guide/schema';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../../../theme';
import { NAVIGATE_BUTTON_HEIGHT } from '../../NavigateButton';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primaryBackground,
    height: NAVIGATE_BUTTON_HEIGHT,
    flex: 1,
  },
  header: {
    flex: 1,
    padding: 8,
  },
});

interface Props {
  poi?: PointCoreFragment | null;
}

export const SelectedPOIHeader: React.FC<Props> = React.memo(({ poi }) => {
  const { t } = useTranslation();
  const kind = poi?.kind ?? 'other';
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text variant="bodyMedium">{poi?.name ?? ' '}</Text>
        <Text variant="bodySmall">{t(`poiTypes:${kind}`)}</Text>
      </View>
    </View>
  );
});

SelectedPOIHeader.displayName = 'SelectedPOIHeader';

export default SelectedPOIHeader;
