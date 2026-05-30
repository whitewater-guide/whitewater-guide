import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import theme from '../../../../theme';
import { SECTIONS_LIST_SUBTITLE_HEIGHT } from './constants';

const styles = StyleSheet.create({
  container: {
    height: SECTIONS_LIST_SUBTITLE_HEIGHT,
    justifyContent: 'center',
    marginLeft: theme.margin.single,
  },
});

interface Props {
  i18nKey: string;
}

function SectionsListSubtitle({ i18nKey }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text variant="bodySmall">{t(i18nKey)}</Text>
    </View>
  );
}

export default memo(SectionsListSubtitle);
