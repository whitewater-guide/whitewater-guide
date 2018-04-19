import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';
import { RegionConsumer } from '../../ww-clients/features/regions';

export const RegionTabs: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <RegionConsumer>
      {(region) => (
        <Text>{JSON.stringify(region)}</Text>
      )}
    </RegionConsumer>
  </Screen>
);
