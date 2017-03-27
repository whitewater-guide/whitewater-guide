import React, { PropTypes } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function Screen({ children }) {
  return (
    <View style={styles.screen}>
      {children}
    </View>
  );
}

Screen.propTypes = {
  children: PropTypes.node,
};

Screen.defaultProps = {
  children: null,
};

