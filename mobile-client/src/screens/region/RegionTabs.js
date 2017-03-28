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
  },
);

export default compose(
  setStatic('router', RegionTabs.router),
  withRegion({ withBounds: true }),
  // It is important to override screenProps, they must be after ...props
  mapProps(({ region, regionLoading, ...props }) => ({ ...props, screenProps: { region, regionLoading } })),
)(RegionTabs);


// export default withRegion({ withBounds: true })(RegionTabs);
