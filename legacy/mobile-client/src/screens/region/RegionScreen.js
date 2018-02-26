import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WhitePortal } from 'react-native-portal';
import RegionModalStack from './RegionModalStack';

const RegionScreen = props => (
  <View style={StyleSheet.absoluteFill}>
    <RegionModalStack {...props} />
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <WhitePortal name="regionScreen" />
    </View>
  </View>
);

RegionScreen.router = RegionModalStack.router;

export default RegionScreen;
