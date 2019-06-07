import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import theme from '../../theme';
import { DrawerContext } from './DrawerContext';
import DrawerSidebar from './DrawerSidebar';

export const Drawer: React.FC = ({ children }) => {
  const ref = useRef<DrawerLayout>(null);
  const toggle = useCallback(
    (open: boolean) => {
      if (!ref.current) {
        return;
      }
      if (open) {
        ref.current.openDrawer();
      } else {
        ref.current.closeDrawer();
      }
    },
    [ref],
  );
  const renderDrawer = useCallback(() => <DrawerSidebar />, []);
  return (
    <DrawerContext.Provider value={toggle}>
      <DrawerLayout
        ref={ref}
        drawerBackgroundColor={theme.colors.primaryBackground}
        drawerWidth={300}
        keyboardDismissMode="on-drag"
        renderNavigationView={renderDrawer}
        drawerPosition="left"
        useNativeAnimations={true}
      >
        <View style={StyleSheet.absoluteFill}>{children}</View>
      </DrawerLayout>
    </DrawerContext.Provider>
  );
};
