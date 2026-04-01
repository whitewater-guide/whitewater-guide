import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../../theme';

export const REGIONS_LIST_SUBTITLE_HEIGHT = 32;

const styles = StyleSheet.create({
  container: {
    height: REGIONS_LIST_SUBTITLE_HEIGHT,
    justifyContent: 'center',
    marginLeft: theme.margin.single,
  },
});

interface Props {
  i18nKey: string;
}

function RegionsListSubtitle({ i18nKey }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="bodySmall">{t(i18nKey)}</Text>
    </View>
  );
}

export default memo(RegionsListSubtitle);
