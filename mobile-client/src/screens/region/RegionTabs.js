import React from 'react';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { connect } from 'react-redux';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { RegionFilterScreen } from './filter';
import { RegionSectionsScreen } from './sections';
import { withRegion } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';
import { withErrorsView, spinnerWhileLoading } from '../../components';
import { SectionSearchHeader, FilterButton } from '../sections-list';

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
    lazy: true,
    navigationOptions: ({ navigation, navigationOptions }) => ({
      headerTitle: (<SectionSearchHeader regionId={navigation.state.params.regionId} />),
      headerRight: (<FilterButton />),
      ...navigationOptions,
    }),
  },
);

const RegionTabsEnhanced = compose(
  setStatic('router', RegionTabs.router),
  connect((state) => {
    const allSearchTerms = state.persistent.sectionSearchTerms;
    return { sectionSearchTerms: allSearchTerms[allSearchTerms.currentRegion] };
  }),
  withRegion({ withBounds: true }),
  spinnerWhileLoading(props => props.regionLoading),
  withSectionsList({ withGeo: true }),
  withErrorsView,
  mapProps(({ region, sections, navigation, screenProps }) => ({
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

