import React, { ErrorInfo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  error: Error;
  info: ErrorInfo | null;
}

const ErrorBoundaryFallback: React.FC<Props> = ({ error, info }) => {
  const [t] = useTranslation();
  const copyBugReport = useCallback(() => {
    Clipboard.setString(
      `Error:\n${error}\n\nComponent stack: ${info && info.componentStack}`,
    );
  }, [error, info]);
  return (
    <View style={styles.container}>
      <Icon icon="bug" />
      <Subheading>{t('commons:bug')}</Subheading>
      <TouchableOpacity onPress={copyBugReport}>
        <Caption>{t('commons:copyBugReport')}</Caption>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorBoundaryFallback;
