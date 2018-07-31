import React from 'react';
import { WithI18n } from 'react-i18next';
import { NavigationState, Scene, TabView } from 'react-native-tab-view';
import theme from '../../../theme';
import { PremiumRegion, PurchaseDialogStep } from '../types';
import AlreadyHaveStep from './already-have';
import AuthStep from './auth';
import BuyProductStep from './buy';
import DialogBody from './DialogBody';
import SuccessStep from './success';

const initialLayout = {
  width: theme.screenWidth,
  height: 0,
};

interface Key {
  key: PurchaseDialogStep;
}

type State = NavigationState<Key>;

interface Props {
  region: PremiumRegion | null;
  step: PurchaseDialogStep;
  cancelable?: boolean;

  onFetchProduct: () => void;
}

export class PremiumDialogView extends React.PureComponent<Props & WithI18n, State> {
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
      <DialogBody title={t('iap:dialog.title', { region: region.name })}>
        <TabView
          navigationState={this.state}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
          initialLayout={initialLayout}
          renderTabBar={this.renderTabBar}
          swipeEnabled={false}
        />
      </DialogBody>
    );
  }
}
