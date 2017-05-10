import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { RegionFilterScreen } from './filter';
import { withRegion } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';

import { withErrorsView, spinnerWhileLoading } from '../../components';
import RegionHeader from './RegionHeader';
import RegionSectionsScreen from './RegionSectionsScreen';
import FilterButton from './FilterButton';

const RegionTabs = TabNavigator(
  {
    RegionMap: { screen: RegionMapScreen },
    RegionDescription: { screen: RegionDescriptionScreen },
    RegionSections: { screen: RegionSectionsScreen },
  },
  {
    initialRouteName: 'RegionMap',
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    swipeEnabled: false,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      headerTitle: (<RegionHeader regionId={navigation.state.params.regionId} />),
      headerRight: (<FilterButton />),
      ...navigationOptions,
    }),
  },
);

const RegionTabsEnhanced = compose(
  setStatic('router', RegionTabs.router),
  withRegion({ withBounds: true }),
  spinnerWhileLoading(props => props.regionLoading),
  withSectionsList({ withGeo: true }),
  withErrorsView,
  mapProps(({ region, sections, navigation, screenProps, ...props }) => ({
    navigation,
    screenProps: { ...screenProps, region, sections },
  })),
)(RegionTabs);

const RegionModalStack = StackNavigator(
  {
    RegionStackMain: {
      screen: RegionTabsEnhanced,
    },
    RegionStackFilter: {
      screen: RegionFilterScreen,
    },
  },
  {
    initialRouteName: 'RegionStackMain',
    mode: 'modal',
    headerMode: 'none',
  },
);

export default RegionModalStack;

