import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { branch, renderComponent } from 'recompose';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Loading: React.SFC = () => (
  <View style={styles.container}>
    <ActivityIndicator color={theme.colors.primary} />
  </View>
);

export function withLoading<TOuter>(isLoading: (props: TOuter) => boolean) {
  return branch<TOuter>(isLoading, renderComponent<{}>(Loading));
}
