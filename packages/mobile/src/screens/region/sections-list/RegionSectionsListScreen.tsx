import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../../components';
import { I18nText } from '../../../i18n';
import { RegionConsumer } from '../../../ww-clients/features/regions';

export const RegionSectionsListScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <RegionConsumer>
      {(region) => (
        <Text>{`Sections of ${region.node.name}`}</Text>
      )}
    </RegionConsumer>
  </Screen>
);

RegionSectionsListScreen.navigationOptions = {
  tabBarLabel: <I18nText>{'region:sections.title'}</I18nText>,
};
