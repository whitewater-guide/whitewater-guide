import { useNetInfo } from '@react-native-community/netinfo';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, Platform, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Caption } from 'react-native-paper';

import theme from '~/theme';

import { MapboxOfflineErrors } from '../errors';

const styles = StyleSheet.create({
  cacheWarningContainer: {
    minHeight: 2 * theme.rowHeight,
    paddingHorizontal: theme.margin.single,
    justifyContent: 'flex-end',
  },
  error: {
    color: theme.colors.error,
  },
  errorWrapper: {
    flexDirection: 'row',
  },
  copy: {
    fontFamily: Platform.select({
      android: 'MaterialCommunityIcons',
      ios: 'Material Design Icons',
    }),
    marginHorizontal: theme.margin.single,
  },
});

interface Props {
  error?: Error;
}

const Errors: React.FC<Required<Props>> = ({ error }) => {
  const { isConnected } = useNetInfo();
  const { t } = useTranslation();

  const copyError = useCallback(() => {
    if (error) {
      Clipboard.setString(JSON.stringify(error, null, 2));
    }
  }, [error]);

  const errorKey =
    error?.name === MapboxOfflineErrors.TILE_LIMIT_EXCEEDED
      ? 'offline:dialog.tileLimitError'
      : 'offline:dialog.downloadError';

  return (
    <React.Fragment>
      <TouchableOpacity onPress={copyError}>
        <Caption style={styles.error}>
          {t(errorKey)}
          <Text style={styles.copy}>{' ' + String.fromCharCode(61839)}</Text>
        </Caption>
      </TouchableOpacity>
      {!isConnected && (
        <Caption style={styles.error}>{t('commons:checkConnection')}</Caption>
      )}
    </React.Fragment>
  );
};

const Warnings: React.FC<Props> = ({ error }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.cacheWarningContainer}>
      {error && <Errors error={error} />}
      <Caption>{t('offline:dialog.cacheWarning')}</Caption>
    </View>
  );
};

export default Warnings;
