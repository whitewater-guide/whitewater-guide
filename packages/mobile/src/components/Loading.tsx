import React from 'react';
import { branch, renderComponent } from 'recompose';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const Loading: React.StatelessComponent = () => (
  <View style={styles.container}>
    <ActivityIndicator color={theme.colors.primary} />
  </View>
);

export function withLoading<TOuter>(isLoading: (props: TOuter) => boolean) {
  return branch<TOuter>(
    isLoading,
    renderComponent(Loading),
  );
}
