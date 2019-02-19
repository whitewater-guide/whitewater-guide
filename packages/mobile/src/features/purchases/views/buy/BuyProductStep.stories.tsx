import { storiesOf } from '@storybook/react-native';
import noop from 'lodash/noop';
import React from 'react';
import { Dialog } from 'react-native-paper';
import { PremiumRegion, PurchaseState } from '../../types';
import DialogBody from '../DialogBody';
import BuyProductStep from './BuyProductStep';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
  sections: { count: 33 },
  hasPremiumAccess: false,
};

storiesOf('Premium dialog: buy product step', module)
  .addDecorator((story: any) => (
    <Dialog onDismiss={noop} visible={true} dismissable={false}>
      <DialogBody title="Get Georgia premium">{story()}</DialogBody>
    </Dialog>
  ))
  .add('Loading product', () => (
    <BuyProductStep region={region} state={PurchaseState.PRODUCT_LOADING} />
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
      error={[
        'iap:errors.savePurchaseOffline',
        { transactionId: '1000000400186472 (1000000400186472)' },
      ]}
      price="700 RUB"
    />
  ))
  .add('Saving purchase - already have', () => (
    <BuyProductStep
      region={region}
      state={PurchaseState.PURCHASE_SAVING_FATAL}
      error={[
        'iap:errors.alreadyOwned',
        { transactionId: '1000000400186472 (1000000400186472)' },
      ]}
      price="700 RUB"
    />
  ))
  .add('Saving purchase - failed', () => (
    <BuyProductStep
      region={region}
      cancelable={false}
      state={PurchaseState.PURCHASE_SAVING_FATAL}
      error={[
        'iap:errors.savePurchase',
        { transactionId: '1000000400186472 (1000000400186472)' },
      ]}
      price="700 RUB"
    />
  ));
