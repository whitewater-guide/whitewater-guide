import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerSidebar from './DrawerSidebar';
import type { RootDrawerParamsList } from './navigation-params';
import RootStack from './RootStack';
import { Screens } from './screen-names';

const Drawer = createDrawerNavigator<RootDrawerParamsList>();

function drawerContent(props: DrawerContentComponentProps) {
  return <DrawerSidebar {...props} />;
}

function RootDrawer() {
  return (
    <Drawer.Navigator
      id="Drawer"
      drawerContent={drawerContent}
      initialRouteName={Screens.ROOT_STACK}
      screenOptions={{ swipeEnabled: false, headerShown: false }}
    >
      <Drawer.Screen name={Screens.ROOT_STACK} component={RootStack} />
    </Drawer.Navigator>
  );
}

export default RootDrawer;
