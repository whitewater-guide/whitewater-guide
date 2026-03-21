import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

import theme from '~/theme';

export const REGIONS_LIST_SUBTITLE_HEIGHT = 32;

const styles = StyleSheet.create({
  container: {
    height: REGIONS_LIST_SUBTITLE_HEIGHT,
    justifyContent: 'center',
    marginLeft: theme.margin.single,
  },
});

interface Props {
  i18nkey: string;
}

export const RegionsListSubtitle = memo<Props>(({ i18nkey }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Caption>{t(i18nkey)}</Caption>
    </View>
  );
});
