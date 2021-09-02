import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';

import theme from '~/theme';

import { SECTIONS_LIST_SUBTITLE_HEIGHT } from './constants';

const styles = StyleSheet.create({
  container: {
    height: SECTIONS_LIST_SUBTITLE_HEIGHT,
    justifyContent: 'center',
    paddingLeft: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.primaryBackground,
  },
});

interface Props {
  i18nkey: string;
}

export const SectionsListSubtitle = memo<Props>(({ i18nkey }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Caption>{t(i18nkey)}</Caption>
    </View>
  );
});
