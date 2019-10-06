import { NavigationScreenComponent } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

export type StackNavigatorConfig = Parameters<typeof createStackNavigator>[1];
export type TabNavigatorConfig = Parameters<
  typeof createMaterialTopTabNavigator
>[1];

export type WrappedStackNavigator = NavigationScreenComponent & {
  router?: any;
};
