import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spinner } from 'native-base';

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LoadingPlug = () => (
  <View style={styles.spinnerContainer}>
    <Spinner color="blue" />
  </View>
);
