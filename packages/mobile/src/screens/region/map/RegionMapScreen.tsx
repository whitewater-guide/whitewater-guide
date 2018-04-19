import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import { RegionConsumer } from '../../../ww-clients/features/regions';

export const RegionMapScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <RegionConsumer>
      {(region) => (
        <Text>{`Map of ${region.node.name}`}</Text>
      )}
    </RegionConsumer>
  </Screen>
);

RegionMapScreen.navigationOptions = {
  tabBarLabel: <I18nText>region:map.title</I18nText>,
};
