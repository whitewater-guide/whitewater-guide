import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';
import RegionsListView from './RegionsListView';

export const RegionsListScreen: NavigationScreenComponent = ({
  navigation,
}) => (
  <Screen>
    <RegionsListView navigate={navigation.navigate} />
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerTitle: 'regionsList:title',
};
