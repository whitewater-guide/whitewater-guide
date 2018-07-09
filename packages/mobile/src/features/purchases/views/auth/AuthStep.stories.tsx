import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import { Provider } from 'react-redux';
import createMockStore from 'redux-mock-store';
import { I18nProvider } from '../../../../i18n';
import AuthStep from './AuthStep';

const store = createMockStore()({});

const user = {
  avatar: 'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-1/p160x160/1780622_1380926282175020_67535950_n.jpg?_nc_cat=0&oh=6c40b79c5d47773187ce5e33e93e3f5f&oe=5BE3D1F0',
  name: 'Konstantin Kuznetsov',
};

storiesOf('Premium dialog: auth step')
  .addDecorator((story) => (
    <I18nProvider>
      <Provider store={store}>
        <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
          <Paper elevation={2} style={{ height: 450 }}>
            {story()}
          </Paper>
        </View>
      </Provider>
    </I18nProvider>
  ))
  .add('Without user', () => (
    <AuthStep cancelable={false} me={null} />
  ))
  .add('Without user, cancelable', () => (
    <AuthStep me={null} />
  ))
  .add('With user', () => (
    <AuthStep cancelable={false} me={user} />
  ))
  .add('With user, cancelable', () => (
    <AuthStep me={user} />
  ));
