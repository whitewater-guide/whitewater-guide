import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default () => (
  <View style={styles.container}>
    <Text>No guide for this section yet...</Text>
  </View>
);
