import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Caption, Subheading } from 'react-native-paper';
import { Icon } from '../../../components';
import theme from '../../../theme';
import { GraphqlProps } from './types';

const styles = StyleSheet.create({
  container: {
    height: 5 * theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margin.double,
  },
});

interface Props {
  summary: GraphqlProps['summary'];
}

const LoadingSummary: React.FC<Props> = ({ summary }) => {
  const [t] = useTranslation();
  const { error, refetch } = summary;
  if (error) {
    return (
      <View style={styles.container}>
        <Icon icon="alert" />
        <Subheading>{t('offline:dialog.summaryError')}</Subheading>
        <Button color={theme.colors.primary} compact={true} onPress={refetch}>
          {t('commons:retry')}
        </Button>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} />
      <Caption>{t('offline:dialog.loadingSummary')}</Caption>
    </View>
  );
};

export default LoadingSummary;
