import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenComponent } from 'react-navigation';
import { BurgerButton, Screen } from '../../components';
import I18n from '../../i18n';

export const RegionsListScreen: NavigationScreenComponent = () =>  (
  <Screen noScroll>
    <Text>Regions List</Text>
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerLeft: (<BurgerButton />),
  headerTitle: I18n.t('regionsList.title'),
};
