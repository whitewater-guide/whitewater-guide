import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import container from './container';
import FilterScreenContent from './FilterScreenContent';
import ResetFilterButton from './ResetFilterButton';

const FilterWithData = container(FilterScreenContent);

export const FilterScreen: NavigationScreenComponent = ({ navigation }) => (
  <FilterWithData navigation={navigation as any} />
);

FilterScreen.navigationOptions = ({ navigation }) => ({
  headerTitle: 'filter:title',
  headerRight: <ResetFilterButton navigation={navigation} />,
});
