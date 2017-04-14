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

const RegionTabs = TabNavigator(
  {
    Map: { screen: RegionMapScreen },
    Description: { screen: RegionDescriptionScreen },
    Sections: { screen: RegionSectionsScreen },
  },
  {
    initialRouteName: 'Map',
    tabBarPosition: 'bottom',
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      headerTitle: (<RegionHeader regionId={navigation.state.params.regionId} />),
    }),
  },
);


export default compose(
  setStatic('router', RegionTabs.router),
  withRegion({ withBounds: true }),
  spinnerWhileLoading(props => props.regionLoading),
  withSectionsList({ withGeo: true }),
  withErrorsView,
  mapProps(({ region, regionId, sections, screenProps, ...props }) => ({
    ...props,
    screenProps: { ...screenProps, region, sections },
  })),
)(RegionTabs);
