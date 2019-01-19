import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import OfflineCategory from './OfflineCategory';

storiesOf('OfflineCategory', module)
  .addDecorator((story: any) => (
    <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
      <Surface style={{ alignSelf: 'stretch', margin: 16, elevation: 2 }}>
        {story()}
      </Surface>
    </View>
  ))
  .add('Default', () => (
    <OfflineCategory
      type="data"
      label="Detailed sections info"
      size={12345678}
      onToggle={action('toggle')}
    />
  ))
  .add('Checked', () => (
    <OfflineCategory
      selected
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Disabled', () => (
    <OfflineCategory
      disabled
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Checked disabled', () => (
    <OfflineCategory
      selected
      disabled
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Disabled unavailable', () => (
    <OfflineCategory
      unavailable
      disabled
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('In progress without progress', () => (
    <OfflineCategory
      inProgress
      type="data"
      label="Detailed sections info"
    />
  ))
  .add('In progress', () => (
    <OfflineCategory
      inProgress
      type="data"
      progress={[7, 10]}
      label="Detailed sections info"
    />
  ));
