import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  t1: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  t2: {
    fontSize: 18,
  },
  t3: {
    fontSize: 16,
  },
});

export default () => (
  <View style={styles.container}>
    <Text style={styles.t1}>Oops!</Text>
    <Text style={styles.t2}>Could not find any sections</Text>
    <Text style={styles.t3}>Please check your search criteria</Text>
  </View>
);
