import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import spinnerHOC from '../commons/utils/spinnerWhileLoading';
import theme from '../theme';

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
    <ActivityIndicator color={theme.colors.primary} size="large" />
  </View>
);

export const spinnerWhileLoading = isLoading => spinnerHOC(isLoading, LoadingPlug);
