import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import SectionTabs from './SectionTabs';

const RegionScreen = props => (
  <View style={StyleSheet.absoluteFill}>
    <SectionTabs {...props} />
    <WhitePortal name="sectionScreen" />
  </View>
);

RegionScreen.router = SectionTabs.router;

export default RegionScreen;
