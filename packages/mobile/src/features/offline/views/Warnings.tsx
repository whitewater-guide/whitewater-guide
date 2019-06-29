import { useNetInfo } from '@react-native-community/netinfo';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Caption } from 'react-native-paper';
import theme from '../../../theme';

const styles = StyleSheet.create({
  cacheWarningContainer: {
    minHeight: 2 * theme.rowHeight,
    paddingHorizontal: theme.margin.single,
    justifyContent: 'flex-end',
  },
  error: {
    color: theme.colors.error,
  },
});

interface Props {
  error?: string | null;
}

const Warnings: React.FC<Props> = ({ error }) => {
  const { t } = useTranslation();
  const { isConnected } = useNetInfo();
  return (
    <View style={styles.cacheWarningContainer}>
      {error && (
        <Caption style={styles.error}>
          {t(error)} {isConnected ? '' : t('commons:checkConnection')}
        </Caption>
      )}
      <Caption>{t('offline:dialog:cacheWarning')}</Caption>
    </View>
  );
};

export default Warnings;
