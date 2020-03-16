import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import React from 'react';
import { Screens } from '~/core/navigation';
import DrawerSidebar from './DrawerSidebar';
import RootStack from './RootStack';

const Drawer = createDrawerNavigator();

const drawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>,
): React.ReactNode => <DrawerSidebar {...props} />;

export const RootDrawer: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={drawerContent}
      screenOptions={{ gestureEnabled: false }}
    >
      <Drawer.Screen name={Screens.ROOT_STACK} component={RootStack} />
    </Drawer.Navigator>
  );
};
