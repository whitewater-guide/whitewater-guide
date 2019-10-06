import ErrorBoundary from 'components/ErrorBoundary';
import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import FilterScreenView from './FilterScreenView';
import { NavParams } from './types';

const FilterScreen: NavigationScreenComponent<NavParams> = ({ navigation }) => (
  <ErrorBoundary>
    <FilterScreenView regionId={navigation.getParam('regionId')} />
  </ErrorBoundary>
);

export default FilterScreen;
