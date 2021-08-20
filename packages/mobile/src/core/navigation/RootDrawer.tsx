import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React from 'react';

import { Screens } from '~/core/navigation';

import DrawerSidebar from './DrawerSidebar';
import RootStack from './RootStack';

const Drawer = createDrawerNavigator();

const drawerContent = (props: DrawerContentComponentProps): React.ReactNode => (
  <DrawerSidebar {...props} />
);

export const RootDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={drawerContent}
    initialRouteName={Screens.ROOT_STACK}
    screenOptions={{ swipeEnabled: false, headerShown: false }}
  >
    <Drawer.Screen name={Screens.ROOT_STACK} component={RootStack} />
  </Drawer.Navigator>
);
