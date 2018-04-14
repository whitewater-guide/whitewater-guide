import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DrawerItem } from '../components';
import I18n from '../i18n';

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
      label={I18n.t('drawer.regions')}
      routeName="RegionsRoot"
    />
    <DrawerItem
      label={I18n.t('drawer.faq')}
      routeName="Plain"
      params={{ data: 'fixture', title: 'FAQ', textId: 'faq', format: 'md' }}
    />
    <DrawerItem
      label={I18n.t('drawer.termsAndConditions')}
      routeName="Plain"
      params={{ data: 'fixture', title: 'Terms and conditions', textId: 'termsAndConditions', format: 'md' }}
    />
    <DrawerItem
      label={I18n.t('drawer.privacyPolicy')}
      routeName="Plain"
      params={{ data: 'fixture', title: 'Privacy policy', textId: 'privacyPolicy', format: 'md' }}
    />
  </View>
);

export default Drawer;
