import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { I18nProvider } from '../../../../i18n';
import { PremiumRegion } from '../../types';
import SuccessStep from './SuccessStep';

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
};

storiesOf('Premium dialog: success step')
  .addDecorator((story) => (
    <I18nProvider>
      <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
        <Paper elevation={2} style={{ height: 450 }}>
          {story()}
        </Paper>
      </View>
    </I18nProvider>
  ))
  .add('Default', () => (
    <SuccessStep
      region={region}
    />
  ));
