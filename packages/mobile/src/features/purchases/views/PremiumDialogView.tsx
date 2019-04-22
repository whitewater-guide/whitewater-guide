import React from 'react';
import { WithTranslation } from 'react-i18next';
import { NavigationState, Scene, TabView } from 'react-native-tab-view';
import { PremiumRegion, PurchaseDialogStep } from '../types';
import AlreadyHaveStep from './already-have';
import AuthStep from './auth';
import BuyProductStep from './buy';
import DialogBody from './DialogBody';
import SuccessStep from './success';

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

export class PremiumDialogView extends React.PureComponent<
  Props & WithTranslation,
  State
> {
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
        return <AlreadyHaveStep />;
      case 'Auth':
        return <AuthStep cancelable={cancelable} />;
      case 'BuyProduct':
        return <BuyProductStep cancelable={cancelable} />;
      case 'Success':
        return <SuccessStep />;
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
          renderTabBar={this.renderTabBar}
          swipeEnabled={false}
        />
      </DialogBody>
    );
  }
}
