import React from 'react';
import { StyleSheet, View, ViewProperties } from 'react-native';

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

export const HandleLeft: React.StatelessComponent<ViewProperties> = ({ children, ...props }) => {
  return (
    <View {...props} style={[styles.handleLeft, props.style]}>
      {children}
    </View>
  )
};


export const Handle: React.StatelessComponent<ViewProperties> = ({ children, ...props }) => {
  return (
    <View {...props} style={[styles.handle, props.style]}>
      {children}
    </View>
  )
};
