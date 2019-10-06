import { Screen } from 'components/Screen';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import RegionsListView from './RegionsListView';

export const RegionsListScreen: NavigationScreenComponent = () => (
  <Screen>
    <RegionsListView />
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerTitle: 'regionsList:title',
};
