import React from 'react';
import PropTypes from 'prop-types';
import { PortalProvider, WhitePortal } from 'react-native-portal';
import { StyleSheet, View } from 'react-native';

export const GuidedTourProvider = ({ children }, context) => {
  const portalView = (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {children}
      <WhitePortal name="guidedTourPortal" />
    </View>
  );
  if (context.portalSub) {
    return portalView;
  }
  return (
    <PortalProvider>
      {portalView}
    </PortalProvider>
  );
};

GuidedTourProvider.contextTypes = {
  portalSub: PropTypes.func,
};
