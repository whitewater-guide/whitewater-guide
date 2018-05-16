import React from 'react';
import { translate } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import { WithT } from '../i18n';
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
  refetch?: () => Promise<any>;
}

class OfflineQueryPlaceholderInner extends React.PureComponent<Props & WithT> {
  onRetry = async () => {
    try {
      this.props.refetch();
    } catch (e) {}
  };

  render() {
    return (
      <View style={styles.container}>
        <Icon icon="alert" />
        <Subheading>{this.props.t('commons:offline')}</Subheading>
        {
          !!this.props.refetch &&
          (
            <Button primary compact onPress={this.onRetry}>
              {this.props.t('commons:retry')}
            </Button>
          )
        }
      </View>
    );
  }
}

export const OfflineQueryPlaceholder = translate()(OfflineQueryPlaceholderInner);
