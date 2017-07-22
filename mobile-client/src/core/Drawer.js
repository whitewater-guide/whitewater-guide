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
    <DrawerItem
      label="Regions"
      routeName="RegionsRoot"
    />
    <DrawerItem
      label="FAQ"
      routeName="Plain"
      params={{ data: 'fixture', title: 'FAQ', textId: 'faq', format: 'md' }}
    />
    <DrawerItem
      label="Terms and conditions"
      routeName="Plain"
      params={{ data: 'fixture', title: 'Terms and conditions', textId: 'legal', format: 'md' }}
    />
  </View>
);

export default Drawer;
