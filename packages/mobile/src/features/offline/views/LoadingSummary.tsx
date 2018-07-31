import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Caption, Subheading } from 'react-native-paper';
import { Icon } from '../../../components';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { GraphqlProps } from './types';

const styles = StyleSheet.create({
  container: {
    height: 4 * theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.margin.double,
  },
});

interface Props extends WithT {
  summary: GraphqlProps['summary'];
}

class LoadingSummary extends React.PureComponent<Props> {
  render() {
    const { summary, t } = this.props;
    const { error, refetch } = summary;
    if (error) {
      return (
        <View style={styles.container}>
          <Icon icon="alert" />
          <Subheading>{t('offline:dialog.summaryError')}</Subheading>
          <Button primary compact onPress={refetch}>
            {this.props.t('commons:retry')}
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
  }
}

export default LoadingSummary;