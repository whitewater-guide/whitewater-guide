import { getHeaderRenderer } from 'components/header';
import { createStackNavigator } from 'react-navigation-stack';
import { StackNavigatorConfig } from '../../utils/navigation';
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
