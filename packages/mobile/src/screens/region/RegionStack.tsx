import { createStackNavigator, StackNavigatorConfig } from 'react-navigation';
import { getHeaderRenderer } from '../../components/header';
import Screens from '../screen-names';
import { AddSectionStack } from './add-section';
import RegionTabs from './RegionTabs';

const routes = {
  [Screens.Region.Tabs.Root]: {
    screen: RegionTabs,
  },
  [Screens.Region.AddSection.Root]: {
    screen: AddSectionStack,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.Region.Tabs.Root,
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: getHeaderRenderer(false),
    gesturesEnabled: false,
  },
};

const RegionStack = createStackNavigator(routes, config);

export default RegionStack;
