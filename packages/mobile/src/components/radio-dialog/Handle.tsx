import React from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  handle: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 36,
  },
  handleLeft: {
    flex: 1,
  },
});

export const HandleLeft: React.FC<ViewProps> = ({ children, ...props }) => (
  <View {...props} style={[styles.handleLeft, props.style]}>
    {children}
  </View>
);

export const Handle: React.FC<ViewProps> = ({ children, ...props }) => (
  <View {...props} style={[styles.handle, props.style]}>
    {children}
  </View>
);
