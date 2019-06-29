import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import FilterScreenView from './FilterScreenView';
import ResetFilterButton from './ResetFilterButton';
import { NavParams } from './types';

export const FilterScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => <FilterScreenView regionId={navigation.getParam('regionId')} />;

FilterScreen.navigationOptions = () => ({
  headerTitle: 'filter:title',
  headerRight: <ResetFilterButton />,
});
