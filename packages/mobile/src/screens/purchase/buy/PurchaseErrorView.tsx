import { useNetInfo } from '@react-native-community/netinfo';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Subheading } from 'react-native-paper';

import copyAndToast from '~/utils/copyAndToast';

import { IAPError } from '../../../features/purchases';
import theme from '../../../theme';

const styles = StyleSheet.create({
  errorWrapper: {
    marginTop: theme.margin.double,
    minHeight: theme.rowHeight,
    justifyContent: 'flex-end',
  },
  error: {
    color: theme.colors.error,
  },
  networkError: {
    color: theme.colors.error,
    marginTop: theme.margin.single,
  },
  copy: {
    fontFamily: Platform.select({
      android: 'MaterialCommunityIcons',
      ios: 'Material Design Icons',
    }),
    marginRight: theme.margin.single,
  },
});

interface Props {
  error?: IAPError | null;
}

const PurchaseErrorView: React.FC<Props> = React.memo(({ error }) => {
  const { t } = useTranslation();
  const { isConnected } = useNetInfo();
  const errorString = error ? t(error.message, error.options) : null;
  const copyError = useCallback(() => {
    if (error) {
      copyAndToast(`${errorString}\n${error.description}`);
    }
  }, [error, errorString]);
  if (!error) {
    return null;
  }
  return (
    <View style={styles.errorWrapper}>
      <TouchableOpacity onPress={copyError}>
        <Subheading style={styles.error}>
          <Text style={styles.copy}>{`${String.fromCharCode(61839)} `}</Text>
          {errorString}
        </Subheading>
        {!isConnected && (
          <Subheading style={styles.networkError}>
            {t('commons:checkConnection')}
          </Subheading>
        )}
      </TouchableOpacity>
    </View>
  );
});

PurchaseErrorView.displayName = 'PurchaseErrorView';

export default PurchaseErrorView;
