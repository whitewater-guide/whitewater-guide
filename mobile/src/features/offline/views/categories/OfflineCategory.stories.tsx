import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react-native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';

import theme from '../../../../theme';
import DeleteMapsButton from './DeleteMapsButton';
import OfflineCategory from './OfflineCategory';
import OfflineCategoryProgress from './OfflineCategoryProgress';

storiesOf('OfflineCategory', module)
  .addDecorator((story: any) => (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        padding: 8,
        paddingTop: 64,
        backgroundColor: '#AAA',
      }}
    >
      <Surface style={{ alignSelf: 'stretch', margin: 16, elevation: 2 }}>
        {story()}
      </Surface>
    </View>
  ))
  .add('Default', () => (
    <OfflineCategory
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Checked', () => (
    <OfflineCategory
      selected={true}
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Disabled', () => (
    <OfflineCategory
      disabled={true}
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Checked disabled', () => (
    <OfflineCategory
      selected={true}
      disabled={true}
      type="data"
      label="Detailed sections info"
      onToggle={action('toggle')}
    />
  ))
  .add('Maps (loading)', () => (
    <OfflineCategory
      selected={false}
      disabled={true}
      type="maps"
      label="Maps (~1234 Mb)"
      onToggle={action('toggle')}
    >
      <ActivityIndicator size="small" color={theme.colors.primary} />
    </OfflineCategory>
  ))
  .add('Maps (loaded)', () => (
    <OfflineCategory
      selected={false}
      disabled={true}
      type="maps"
      label="Maps (~1234 Mb)"
      onToggle={action('toggle')}
    >
      <DeleteMapsButton onDelete={action('delete')} size={123456789} />
    </OfflineCategory>
  ))
  .add('Progress', () => (
    <OfflineCategoryProgress label="Maps (~123 Mb)" progress={[33, 100]} />
  ));
