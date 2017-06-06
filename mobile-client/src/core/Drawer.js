import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerItem } from '../components';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    padding: 4,
    paddingTop: 32,
  },
});

const Drawer = () => (
  <View style={styles.container}>
    <DrawerItem label="Regions" routeName="RegionsRoot" />
    <DrawerItem label="All Sections" routeName="AllSectionsRoot" />
  </View>
);

export default Drawer;
