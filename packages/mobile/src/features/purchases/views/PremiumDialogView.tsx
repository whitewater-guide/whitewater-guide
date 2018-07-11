import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DialogTitle } from 'react-native-paper';
import { NavigationState, Scene, TabView } from 'react-native-tab-view';
import { WithT } from '../../../i18n';
import theme from '../../../theme';
import { PremiumRegion, PurchaseDialogStep } from '../types';
import AlreadyHaveStep from './already-have';
import AuthStep from './auth';
import BuyProductStep from './buy';
import SuccessStep from './success';

const initialLayout = {
  width: theme.screenWidth,
  height: 0,
};

const styles = StyleSheet.create({
  root: {
    minHeight: 450,
  },
});

interface Key {
  key: PurchaseDialogStep;
}

type State = NavigationState<Key>;

interface Props extends WithT {
  region?: PremiumRegion;
  step: PurchaseDialogStep;
  cancelable?: boolean;

  onFetchProduct: () => void;
}

export class PremiumDialogView extends React.PureComponent<Props, State> {
  readonly state: State = {
    index: 2,
    routes: [
      { key: 'AlreadyHave' },
      { key: 'Auth' },
      { key: 'BuyProduct' },
      { key: 'Success' },
    ],
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      index: state.routes.findIndex((route) => route.key === props.step),
    };
  }

  componentDidMount() {
    this.props.onFetchProduct();
  }

  onIndexChange = (index: number) => this.setState({ ...this.state, index });

  renderScene = ({ route }: Scene<Key>) => {
    const { cancelable } = this.props;
    switch (route.key) {
      case 'AlreadyHave':
        return (
          <AlreadyHaveStep />
        );
      case 'Auth':
        return (
          <AuthStep cancelable={cancelable} />
        );
      case 'BuyProduct':
        return (
          <BuyProductStep cancelable={cancelable} />
        );
      case 'Success':
        return (
          <SuccessStep />
        );
      default:
        return null;
    }
  };

  renderTabBar = () => null;

  render() {
    const { region, t } = this.props;
    if (!region) {
      return null;
    }
    return (
      <View style={styles.root}>
        <DialogTitle>{t('iap:dialog.title', { region: region.name })}</DialogTitle>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
          initialLayout={initialLayout}
          renderTabBar={this.renderTabBar}
          swipeEnabled={false}
        />
      </View>
    );
  }
}
