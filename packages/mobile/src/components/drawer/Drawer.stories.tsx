import { storiesOf } from '@storybook/react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Drawer } from './Drawer';
import { useDrawer } from './DrawerContext';

const DrawerControls = () => {
  const toggleDrawer = useDrawer();
  useEffect(() => {
    toggleDrawer(true);
  }, []);
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Button onPress={() => toggleDrawer(true)}>Open Drawer</Button>
      <Button onPress={() => toggleDrawer(false)}>Close Drawer</Button>
    </View>
  );
};

storiesOf('Drawer', module).add('Default', () => (
  <Drawer>
    <DrawerControls />
  </Drawer>
));
