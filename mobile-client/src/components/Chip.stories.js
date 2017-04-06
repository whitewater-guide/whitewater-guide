import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@kadira/react-native-storybook';
import Chip from './Chip';

storiesOf('Chip')
  .add('default', () => (
    <View style={{ flexDirection: 'row' }}>
      <Chip label="Dam soon" />
      <Chip label="Angry local" color="red" />
      <Chip label="Pool-drop" color="green" />
    </View>
  ));
