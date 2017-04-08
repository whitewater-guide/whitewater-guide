import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Spinner } from 'native-base';
import { default as spinnerHOC } from '../commons/utils/spinnerWhileLoading';

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

export const spinnerWhileLoading = isLoading => spinnerHOC(isLoading, LoadingPlug);
