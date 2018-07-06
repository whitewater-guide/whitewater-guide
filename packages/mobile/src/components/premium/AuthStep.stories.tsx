import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { I18nProvider } from '../../i18n';
import { AuthStep } from './AuthStep';
import { PremiumRegion } from './types';

const store = createMockStore()({});

const region: PremiumRegion = {
  id: '1111',
  name: 'Georgia',
  sku: 'region.georgia',
};

const user = {
  avatar: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-1/p160x160/1780622_1380926282175020_67535950_n.jpg?_nc_cat=0&oh=6c40b79c5d47773187ce5e33e93e3f5f&oe=5BE3D1F0',
  name: 'Konstantin Kuznetsov',
};

storiesOf('Premium dialog: auth step')
  .addDecorator((story) => (
    <I18nProvider>
      <Provider store={store}>
        <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
          <Paper elevation={2}>
            {story()}
          </Paper>
        </View>
      </Provider>
    </I18nProvider>
  ))
  .add('Without user', () => (
    <AuthStep
      region={region}
      me={null}
    />
  ))
  .add('With user', () => (
    <AuthStep
      region={region}
      me={user}
    />
  ));
