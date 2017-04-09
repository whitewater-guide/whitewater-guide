import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { SectionMapScreen } from './map';
import { SectionChartScreen } from './chart';
import { SectionGuideScreen } from './guide';
import { SectionInfoScreen } from './info';
import { SectionMediaScreen } from './media';
import { withSection } from '../../commons/features/sections';
import { spinnerWhileLoading } from '../../components';
import SectionHeader from './SectionHeader';

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
      header: navigation => ({
        title: (<SectionHeader sectionId={navigation.state.params.sectionId} />),
      }),
      title: 'Section Tabs',
    },
  },
);


export default compose(
  setStatic('router', SectionTabs.router),
  withSection({ withGeo: true, withDescription: true }),
  spinnerWhileLoading(props => props.sectionLoading),
  mapProps(({ section, screenProps, sectionId, ...props }) => ({
    ...props,
    screenProps: { ...screenProps, section },
  })),
)(SectionTabs);
