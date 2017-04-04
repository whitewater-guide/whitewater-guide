import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { SectionMapScreen } from './map';
import { SectionChartScreen } from './chart';
import { SectionGuideScreen } from './guide';
import { SectionInfoScreen } from './info';
import { SectionMediaScreen } from './media';
import { withSection } from '../../commons/features/sections';

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
  withSection({ withGeo: true, withDescription: true }),
  mapProps(({ section, sectionLoading, screenProps, sectionId, ...props }) => ({
    ...props,
    screenProps: { ...screenProps, section, sectionLoading },
  })),
)(SectionTabs);
