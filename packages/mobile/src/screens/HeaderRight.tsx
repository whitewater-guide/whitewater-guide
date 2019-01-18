import React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps, NavigationSceneRendererProps } from 'react-navigation';
import { getNavigationDotPath } from '../utils/navigation';
import ResetFilterButton from './filter/ResetFilterButton';
import FilterButton from './region/FilterButton';

type Props = Pick<NavigationSceneRendererProps, 'navigation'>;

export const HeaderRight: React.FC<Props> = ({ navigation }) => {
  const dotPath = getNavigationDotPath(navigation.state.routes[navigation.state.index]) || '';
  if (dotPath.includes('RegionMap') || dotPath.includes('RegionSectionsList')) {
    return (
      <FilterButton navigation={navigation} />
    );
  }
  if (dotPath.includes('Filter')) {
    return (
      <ResetFilterButton navigation={navigation} />
    );
  }
  return (
    <View />
  );
};
