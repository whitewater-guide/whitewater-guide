import { sleep } from '@whitewater-guide/clients';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import theme from '../theme';
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
  loading?: boolean;
  labelKey?: string;
  buttonKey?: string;
}

interface State {
  // Used to debounce loading animation
  refetching: boolean;
}

class RetryPlaceholderInner extends React.PureComponent<
  Props & WithTranslation,
  State
> {
  readonly state: State = { refetching: false };

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
    const {
      labelKey = 'commons:offline',
      buttonKey = 'commons:retry',
      t,
      loading,
    } = this.props;
    const isBusy = this.state.refetching || loading;
    return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {isBusy ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Icon narrow={true} icon="alert" />
          )}
        </View>
        <Subheading>{t(labelKey)}</Subheading>
        {!!this.props.refetch && (
          <Button
            color={theme.colors.primary}
            compact={true}
            disabled={isBusy}
            onPress={this.onRetry}
          >
            {t(buttonKey)}
          </Button>
        )}
      </View>
    );
  }
}

export const RetryPlaceholder = withTranslation()(RetryPlaceholderInner);
