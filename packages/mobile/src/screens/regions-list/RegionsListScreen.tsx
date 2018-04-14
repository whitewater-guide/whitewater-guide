import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';

export const RegionsListScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <Text>Regions List</Text>
  </Screen>
);
