import { TabNavigator } from 'react-navigation';
import { compose, mapProps, setStatic } from 'recompose';
import { RegionMapScreen } from './map';
import { RegionDescriptionScreen } from './description';
import { withRegion } from '../../commons/features/regions';
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
  },
);

export default compose(
  setStatic('router', RegionTabs.router),
  withRegion({ withBounds: true }),
  mapProps(({ region, regionLoading, regionId, screenProps, ...props }) => ({
    ...props,
    screenProps: { ...screenProps, region, regionLoading },
  })),
)(RegionTabs);
