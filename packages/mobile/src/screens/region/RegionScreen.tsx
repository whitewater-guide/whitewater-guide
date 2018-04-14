import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';

export const RegionScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <Text>Region</Text>
  </Screen>
);
