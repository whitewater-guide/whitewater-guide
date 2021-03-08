import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import theme from '~/theme';

const styles = StyleSheet.create({
  unverified: {
    borderColor: theme.colors.componentBorder,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 2,
    padding: 2,
  },
  unverifiedText: {
    fontSize: 10,
    color: theme.colors.componentBorder,
    textTransform: 'uppercase',
  },
});

const UnverifiedBadge = React.memo(() => {
  const { t } = useTranslation();
  return (
    <View style={styles.unverified}>
      <Text style={styles.unverifiedText}>{t('commons:unverified')}</Text>
    </View>
  );
});

UnverifiedBadge.displayName = 'UnverifiedBadge';

export default UnverifiedBadge;
