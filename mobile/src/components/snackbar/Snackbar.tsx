import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, StyleSheet, Text } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';

import theme from '../../theme';
import { SnackbarContext } from './context';

const styles = StyleSheet.create({
  error: {
    color: theme.colors.error,
  },
});

export const Snackbar: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const message = useContext(SnackbarContext);
  const [visible, setVisible] = useState(false);
  const onDismiss = useCallback(() => setVisible(false), [setVisible]);
  useEffect(() => {
    setVisible(!!message);
  }, [message, setVisible]);
  const action = useMemo(
    () =>
      message && message.full
        ? {
            label: t('commons:copy'),
            onPress: () => Clipboard.setString(message.full!),
          }
        : undefined,
    [message, t],
  );
  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={
        message && message.error
          ? PaperSnackbar.DURATION_MEDIUM
          : PaperSnackbar.DURATION_SHORT
      }
      action={action}
    >
      <Text style={message && message.error && styles.error}>
        {message ? message.short : ''}
      </Text>
    </PaperSnackbar>
  );
});

Snackbar.displayName = 'Snackbar';
