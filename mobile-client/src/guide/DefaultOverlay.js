import React from 'react';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,255,0,0.5)',
  },
});

export const DefaultOverlay = () => (
  <View style={styles.overlay} pointerEvents="none" />
);
