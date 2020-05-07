import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import DrawerSidebar from './DrawerSidebar';
import React from 'react';
import RootStack from './RootStack';
import { Screens } from '~/core/navigation';

const Drawer = createDrawerNavigator();

const drawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
): React.ReactNode => <DrawerSidebar {...props} />;

export const RootDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={drawerContent}
      initialRouteName={Screens.ROOT_STACK}
      screenOptions={{ gestureEnabled: false }}
    >
      <Drawer.Screen name={Screens.ROOT_STACK} component={RootStack} />
    </Drawer.Navigator>
  );
};
