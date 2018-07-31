import { action } from '@storybook/addon-actions';
// @ts-ignore
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Paper } from 'react-native-paper';
import OfflineCategory from './OfflineCategory';

storiesOf('OfflineCategory')
  .addDecorator((story: any) => (
    <View style={{ ...StyleSheet.absoluteFillObject, padding: 8, paddingTop: 64, backgroundColor: '#AAA' }}>
      <Paper elevation={2} style={{ alignSelf: 'stretch', margin: 16 }}>
        {story()}
      </Paper>
    </View>
  ))
  .add('Default', () => (
    <OfflineCategory
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Checked', () => (
    <OfflineCategory
      selected
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Disabled', () => (
    <OfflineCategory
      disabled
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Checked disabled', () => (
    <OfflineCategory
      selected
      disabled
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('In progress', () => (
    <OfflineCategory
      inProgress
      total={10}
      downloaded={7}
      label="Detailed sections info"
    />
  ));
