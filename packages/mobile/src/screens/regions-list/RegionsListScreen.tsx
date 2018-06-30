import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { Screen } from '../../components';
import container from './container';
import RegionsListView from './RegionsListView';
import { OuterProps } from './types';

const RegionsListWithData: React.ComponentType<OuterProps> = container(RegionsListView);

export const RegionsListScreen: NavigationScreenComponent = ({ navigation }) =>  (
  <Screen noScroll noPadding>
    <RegionsListWithData navigate={navigation.navigate} />
  </Screen>
);

RegionsListScreen.navigationOptions = {
  headerTitle: 'regionsList:title',
};
