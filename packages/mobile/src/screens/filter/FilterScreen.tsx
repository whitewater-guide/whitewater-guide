import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import container from './container';
import FilterScreenContent from './FilterScreenContent';

const FilterWithData = container(FilterScreenContent);

export const FilterScreen: NavigationScreenComponent = ({ navigation }) => (
  <FilterWithData navigation={navigation as any} />
);

FilterScreen.navigationOptions = {
  headerTitle: 'filter:title',
};
