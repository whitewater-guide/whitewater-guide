import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { withRegion } from '../../commons/features/regions';
import { withSections } from '../../commons/features/sections';
import RegionHeader from './RegionHeader';
import PageThree from './PageThree';

const RegionTabs = TabNavigator(
  {
    Map: { screen: RegionMapScreen },
    Description: { screen: RegionDescriptionScreen },
    PageThree: { screen: PageThree },
  },
  {
    initialRouteName: 'Map',
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    navigationOptions: {
      header: navigation => ({
        title: (<RegionHeader regionId={navigation.state.params.regionId} />),
      }),
    },
  },
);


export default compose(
  setStatic('router', RegionTabs.router),
  withRegion({ withBounds: true }),
  withSections({ withGeo: true }),
  mapProps(({ region, regionLoading, regionId, sections, screenProps, ...props }) => ({
    ...props,
    screenProps: { ...screenProps, region, regionLoading, sections },
  })),
)(RegionTabs);
