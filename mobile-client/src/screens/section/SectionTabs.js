import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { SectionMapScreen } from './map';
import { SectionChartScreen } from './chart';
import { SectionGuideScreen } from './guide';
import { SectionInfoScreen } from './info';
import { SectionMediaScreen } from './media';

const SectionTabs = TabNavigator(
  {
    Map: { screen: SectionMapScreen },
    Chart: { screen: SectionChartScreen },
    Guide: { screen: SectionGuideScreen },
    Info: { screen: SectionInfoScreen },
    Media: { screen: SectionMediaScreen },
  },
  {
    initialRouteName: 'Map',
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    navigationOptions: {
      // header: navigation => ({
      //   title: (<RegionHeader regionId={navigation.state.params.regionId} />),
      // }),
      title: 'Section Tabs',
    },
  },
);


export default compose(
  setStatic('router', SectionTabs.router),
  // withRegion({ withBounds: true }),
  // withSections({ withGeo: true }),
  mapProps(({ screenProps, ...props }) => ({
    ...props,
    screenProps: { ...screenProps },
  })),
)(SectionTabs);
