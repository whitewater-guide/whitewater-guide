import React from 'react';
import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { withRegion } from '../../commons/features/regions';
import { withSectionsList } from '../../commons/features/sections';

import { withErrorsView, spinnerWhileLoading } from '../../components';
import RegionHeader from './RegionHeader';
import RegionSectionsScreen from './RegionSectionsScreen';
import RegionTabsRight from './RegionTabsRight';

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
    navigationOptions: ({ navigation }) => ({
      headerTitle: (<RegionHeader regionId={navigation.state.params.regionId} />),
      headerRight: (<RegionTabsRight navigation={navigation} />),
    }),
  },
);


export default compose(
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
