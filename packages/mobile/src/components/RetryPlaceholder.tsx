import React from 'react';
import { translate } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import { WithT } from '../i18n';
import theme from '../theme';
import { sleep } from '../ww-clients/utils';
import { Icon } from './Icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  refetch?: () => Promise<any>;
  labelKey?: string;
  loading?: boolean;
}

interface State {
  // Used to debounce loading animation
  refetching: boolean;
}

class RetryPlaceholderInner extends React.PureComponent<Props & WithT, State> {
  readonly state: State = { refetching: false };

  componentDidMount() {
    console.log('CDM');
  }

  componentWillUnmount() {
    console.log('CWU');
  }

  onRetry = async () => {
    const { refetch } = this.props;
    try {
      if (refetch) {
        this.setState({ refetching: true });
        await refetch();
        await sleep(1000);
        this.setState({ refetching: false });
      }
    } catch (e) {}
  };

  render() {
    const { labelKey = 'commons:offline', t, loading } = this.props;
    const isBusy = this.state.refetching || loading;
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {
            isBusy ?
              <ActivityIndicator size="small" color={theme.colors.primary} /> :
              <Icon narrow icon="alert" />
          }
        </View>
        <Subheading>{t(labelKey)}</Subheading>
        {
          !!this.props.refetch &&
          (
            <Button primary compact disabled={isBusy} onPress={this.onRetry}>
              {t('commons:retry')}
            </Button>
          )
        }
      </View>
    );
  }
}

export const RetryPlaceholder = translate()(RetryPlaceholderInner);
