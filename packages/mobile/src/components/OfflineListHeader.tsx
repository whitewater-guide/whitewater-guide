import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Paragraph } from 'react-native-paper';

import Icon from '~/components/Icon';
import theme from '~/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 1.5 * theme.rowHeight,
  },
  icon: {
    marginRight: theme.margin.single,
  },
});

const OfflineListHeader: React.FC = () => {
  const { t } = useTranslation();
  const { isInternetReachable } = useNetInfo();

  if (isInternetReachable !== false) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon icon="cloud-off-outline" style={styles.icon} />
      <Paragraph>{t('commons:offline')}</Paragraph>
    </View>
  );
};

export default OfflineListHeader;
