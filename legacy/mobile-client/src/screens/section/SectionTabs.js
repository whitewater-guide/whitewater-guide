import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { SectionMapScreen } from './map';
import { SectionChartScreen } from './chart';
import { SectionGuideScreen } from './guide';
import { SectionInfoScreen } from './info';
import { SectionMediaScreen } from './media';
import { withSection } from '../../commons/features/sections';
import { spinnerWhileLoading, withErrorsView } from '../../components';
import SectionHeader from './SectionHeader';
import SectionHelpButton from './SectionHelpButton';

const SectionTabs = TabNavigator(
  {
    SectionMap: { screen: SectionMapScreen },
    SectionChart: { screen: SectionChartScreen },
    SectionGuide: { screen: SectionGuideScreen },
    SectionInfo: { screen: SectionInfoScreen },
    SectionMedia: { screen: SectionMediaScreen },
  },
  {
    initialRouteName: 'SectionInfo',
    order: ['SectionMap', 'SectionChart', 'SectionInfo', 'SectionGuide', 'SectionMedia'],
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      iconStyle: { width: 36, height: 36 },
    },
    navigationOptions: ({ navigation }) => ({
      headerTitle: <SectionHeader sectionId={navigation.state.params.sectionId} />,
      headerRight: <SectionHelpButton navigation={navigation} />
    }),
  },
);

export default compose(
  setStatic('router', SectionTabs.router),
  withSection({ withGeo: true, withDescription: true }),
  spinnerWhileLoading(props => props.sectionLoading),
  withErrorsView,
  mapProps(({ section, screenProps, navigation, ...props }) => ({
    navigation,
    screenProps: { ...screenProps, section },
  })),
)(SectionTabs);
