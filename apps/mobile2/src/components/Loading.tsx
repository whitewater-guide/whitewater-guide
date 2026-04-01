import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Props {
  style?: StyleProp<ViewStyle>;
}

function Loading({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        color={theme.colors.primary}
        accessibilityLabel="loading"
      />
    </View>
  );
}

export default Loading;
