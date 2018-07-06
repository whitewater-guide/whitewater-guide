import React from 'react';
import * as RNIap from 'react-native-iap';
import { DialogTitle } from 'react-native-paper';
import { Key, NavigationState, Scene, TabView } from 'react-native-tab-view';
import theme from '../../theme';
import { AlreadyHaveStep } from './AlreadyHaveStep';
import { AuthStep } from './AuthStep';
import { BuyProductStep } from './BuyProductStep';
import { InnerProps } from './container';
import { PREMIUM_DIALOG_QUERY } from './premiumDialog.query';
import { SuccessStep } from './SuccessStep';

const initialLayout = {
  width: theme.screenWidth,
  height: 0,
};

interface State {
  nav: NavigationState<Key>;
  product?: RNIap.Product;
  productLoading: boolean;
  error: boolean;
}

export class PremiumDialogContent extends React.PureComponent<InnerProps, State> {
  readonly state: State = {
    nav: {
      index: 2,
      routes: [
        { key: 'AlreadyHave' },
        { key: 'Auth' },
        { key: 'BuyProduct' },
        { key: 'Success' },
      ],
    },
    productLoading: false,
    error: false,
  };

  async componentDidMount() {
    await this.fetchProduct();
  }

  fetchProduct = async () => {
    try {
      this.setState({ productLoading: true, error: false });
      await RNIap.prepare();
      const [product] = await RNIap.getProducts([this.props.region.sku]);
      this.setState({ product, productLoading: false, error: false });
      await RNIap.endConnection();
    } catch (e) {
      console.log(e);
      this.setState({ product: undefined, productLoading: false, error: true });
    }
  };

  onIndexChange = (index: number) => this.setState({ nav: { ...this.state.nav, index } });

  onAuth = () => this.setState({ nav: { ...this.state.nav, index: 2 } });

  onBuy = async () =>  {
    await RNIap.prepare();
    await RNIap.buyProductWithoutFinishTransaction(this.props.region.sku);
    // buy product from our server
    // TODO: handle network loss here
    await RNIap.finishTransaction();
    await RNIap.endConnection();
    this.setState({ nav: { ...this.state.nav, index: 3 } });
  };

  onComplete = async () => {
    const { client, onCancel, region, sectionId } = this.props;
    await client.query({
      query: PREMIUM_DIALOG_QUERY,
      variables: { regionId: region.id, sectionId },
      fetchPolicy: 'network-only',
    });
    // TODO: handle network break here
    onCancel();
  };

  renderScene = ({ route }: Scene<Key>) => {
    const { me, region, onCancel, cancelable } = this.props;
    const { product, productLoading, error } = this.state;
    switch (route.key) {
      case 'AlreadyHave':
        return (
          <AlreadyHaveStep region={region} onCancel={onCancel} />
        );
      case 'Auth':
        return (
          <AuthStep region={region} me={me} onCancel={onCancel} onContinue={this.onAuth} cancelable={cancelable} />
        );
      case 'BuyProduct':
        return (
          <BuyProductStep
            region={region}
            cancelable={cancelable}
            onCancel={onCancel}
            onBuy={this.onBuy}
            onRefetchIAP={this.fetchProduct}
            price={product && product.localizedPrice}
            priceLoading={productLoading}
            error={error}
          />
        );
      case 'Success':
        return (
          <SuccessStep region={region} onComplete={this.onComplete} />
        );
      default:
        return null;
    }
  };

  renderTabBar = () => null;

  render() {
    const { region } = this.props;
    return (
      <React.Fragment>
        <DialogTitle>{region.name}</DialogTitle>
        <TabView
          navigationState={this.state.nav}
          renderScene={this.renderScene}
          onIndexChange={this.onIndexChange}
          initialLayout={initialLayout}
          renderTabBar={this.renderTabBar}
          swipeEnabled={false}
        />
      </React.Fragment>
    );
  }
}
