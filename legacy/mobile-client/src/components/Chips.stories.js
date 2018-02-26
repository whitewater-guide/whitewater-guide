import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@kadira/react-native-storybook';
import Chips from './Chips';

storiesOf('Chips')
  .add('default', () => (
    <View>
      <Chips
        color="red"
        values={['Syphons', 'Log jams', 'Artificial hazards', 'Undercuts', 'Landslides']}
      />
    </View>
  ));
