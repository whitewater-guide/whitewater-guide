import type { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export interface LoadingProps {
  style?: StyleProp<ViewStyle>;
}

export function Loading({ style }: LoadingProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator color={theme.primary} accessibilityLabel="loading" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
