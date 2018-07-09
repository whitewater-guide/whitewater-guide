import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { I18nProvider } from '../../../../i18n';
import { PremiumRegion, PurchaseState } from '../../types';
import BuyProductStep from './BuyProductStep';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
  sections: { count: 33 },
};

storiesOf('Premium dialog: buy product step')
  .addDecorator((story) => (
    <I18nProvider>
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
        <Paper elevation={2}>
          {story()}
        </Paper>
      </View>
    </I18nProvider>
  ))
  .add('Loading product', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PRODUCT_LOADING}
    />
  ))
  .add('Loading product failed', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PRODUCT_LOADING_FAILED}
      error={['iap:errors.fetchProduct']}
    />
  ))
  .add('Ready to buy', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.IDLE}
      price="700 RUB"
    />
  ))
  .add('Refreshing premium...', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.REFRESHING_PREMIUM}
      price="700 RUB"
    />
  ))
  .add('Refreshing premium failed', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.REFRESHING_PREMIUM_FAILED}
      price="700 RUB"
      error={['iap:errors.refreshPremium']}
    />
  ))
  .add('Purchasing', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PRODUCT_PURCHASING}
      price="700 RUB"
    />
  ))
  .add('Purchasing failed...', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PRODUCT_PURCHASING_FAILED}
      error={['iap:errors.buyProduct']}
      price="700 RUB"
    />
  ))
  .add('Saving purchase', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PURCHASE_SAVING}
      price="700 RUB"
    />
  ))
  .add('Saving purchase - offline', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PURCHASE_SAVING_OFFLINE}
      error={['iap:errors.savePurchaseOffline', { transactionId: 'Bg0fJ8ts99' }]}
      price="700 RUB"
    />
  ))
  .add('Saving purchase - failed', () => (
    <BuyProductStep
      region={region}
      cancelable={false}
      state={PurchaseState.PURCHASE_SAVING_FATAL}
      error={['iap:errors.savePurchase', { transactionId: 'Bg0fJ8ts99' }]}
      price="700 RUB"
    />
  ));
