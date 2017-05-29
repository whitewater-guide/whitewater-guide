import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { connect } from 'react-redux';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { FilterScreen } from '../filter';
import { RegionSectionsScreen } from './sections';
import { withRegion, searchTermsSelector } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';
import { withErrorsView, spinnerWhileLoading } from '../../components';
import { SectionSearchHeader, FilterButton } from '../sections-list';
import RegionTabBar from './RegionTabBar';

const RegionTabs = TabNavigator(
  {
    RegionMap: { screen: RegionMapScreen },
    RegionDescription: { screen: RegionDescriptionScreen },
    RegionSections: { screen: RegionSectionsScreen },
  },
  {
    initialRouteName: 'RegionMap',
    tabBarPosition: 'bottom',
    tabBarComponent: RegionTabBar,
    order: ['RegionMap', 'RegionSections', 'RegionDescription'],
    backBehavior: 'none',
    swipeEnabled: false,
    lazy: true,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      headerTitle: (<SectionSearchHeader regionId={navigation.state.params.regionId} />),
      headerRight: (<FilterButton filterRouteName="RegionStackFilter" regionId={navigation.state.params.regionId} />),
      ...navigationOptions,
    }),
  },
);

const RegionTabsEnhanced = compose(
  setStatic('router', RegionTabs.router),
  connect(searchTermsSelector),
  withRegion({ withBounds: true }),
  spinnerWhileLoading(props => props.regionLoading),
  withSectionsList({ withGeo: true }),
  withErrorsView,
  mapProps(({ region, sections, navigation, screenProps }) => ({
    navigation,
    screenProps: { ...screenProps, region, sections },
  })),
)(RegionTabs);

RegionTabsEnhanced.displayName = 'RegionTabs';

const RegionModalStack = StackNavigator(
  {
    RegionStackMain: {
      screen: RegionTabsEnhanced,
    },
    RegionStackFilter: {
      screen: FilterScreen,
    },
  },
  {
    initialRouteName: 'RegionStackMain',
    mode: 'modal',
    headerMode: 'none',
  },
);

RegionModalStack.displayName = 'RegionModalStack';

export default RegionModalStack;

