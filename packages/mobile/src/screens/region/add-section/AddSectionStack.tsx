import { getHeaderRenderer } from 'components/header';
import React from 'react';
import { register } from 'react-native-bundle-splitter';
import { NavigationRouter, NavigationScreenComponent } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { StackNavigatorConfig } from '../../../utils/navigation';
import Screens from '../../screen-names';
import AddSectionTabs from './AddSectionTabs';
import { LazyGaugeScreen } from './gauge';
import { LazyRiverScreen } from './river';
import { LazyShapeScreen } from './shape';

const routes = {
  [Screens.Region.AddSection.Tabs.Root]: {
    screen: AddSectionTabs,
  },
  [Screens.Region.AddSection.River]: {
    screen: LazyRiverScreen,
  },
  [Screens.Region.AddSection.Gauge]: {
    screen: LazyGaugeScreen,
  },
  [Screens.Region.AddSection.Shape]: {
    screen: LazyShapeScreen,
  },
};

const config: StackNavigatorConfig = {
  initialRouteName: Screens.Region.AddSection.Tabs.Root,
  headerMode: 'screen',
  defaultNavigationOptions: {
    header: getHeaderRenderer(false),
    gesturesEnabled: false,
  },
};

const Navigator = createStackNavigator(routes, config);

const LazyAddSectionStack = register({
  require: () => require('./LazyAddSectionStack'),
});

export const AddSectionStack: NavigationScreenComponent & {
  router?: NavigationRouter;
} = React.memo((props) => {
  return (
    <LazyAddSectionStack>
      <Navigator {...props} />
    </LazyAddSectionStack>
  );
});

AddSectionStack.displayName = 'AddSectionStack';
AddSectionStack.router = Navigator.router;
AddSectionStack.navigationOptions = {
  header: null,
};
