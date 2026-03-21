import stringify from 'fast-json-stable-stringify';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Caption, Subheading } from 'react-native-paper';

import copyAndToast from '~/utils/copyAndToast';

import Icon from './Icon';

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
  componentStack: string | null;
  eventId: string | null;
}

const ErrorBoundaryFallback: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const copyBugReport = useCallback(() => {
    copyAndToast(stringify(props));
  }, [props]);

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
