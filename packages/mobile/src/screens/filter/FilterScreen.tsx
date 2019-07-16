import React from 'react';
import { NavigationScreenComponent } from 'react-navigation';
import { ErrorBoundary } from '../../components';
import FilterScreenView from './FilterScreenView';
import ResetFilterButton from './ResetFilterButton';
import { NavParams } from './types';

export const FilterScreen: NavigationScreenComponent<NavParams> = ({
  navigation,
}) => (
  <ErrorBoundary>
    <FilterScreenView regionId={navigation.getParam('regionId')} />
  </ErrorBoundary>
);

FilterScreen.navigationOptions = () => ({
  headerTitle: 'filter:title',
  headerRight: <ResetFilterButton />,
});
