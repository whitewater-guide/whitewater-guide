import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@kadira/react-native-storybook';
import TabIcon from './TabIcon';

storiesOf('TabIcon')
  .add('default', () => (
    <View style={{ backgroundColor: 'blue', padding: 24, flexDirection: 'row', justifyContent: 'space-around' }}>
      <TabIcon icon="photos" />
      <TabIcon icon="photos" counter={4} />
      <TabIcon icon="photos" counter={12} />
    </View>
  ));
