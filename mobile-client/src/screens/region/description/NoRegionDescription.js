import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../../components';

const styles = {
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default () => (
  <View style={styles.container}>
    <Text>No description for this region</Text>
  </View>
);
