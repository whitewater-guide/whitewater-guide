import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { I18nProvider } from '../../i18n';
import { BuyProductStep } from './BuyProductStep';
import { PremiumRegion } from './types';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
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
  .add('Loading price', () => (
    <BuyProductStep
      region={region}
      priceLoading
    />
  ))
  .add('Error while loading price', () => (
    <BuyProductStep
      region={region}
      error
    />
  ))
  .add('Ready to buy', () => (
    <BuyProductStep
      region={region}
      price="700 RUB"
    />
  ));
