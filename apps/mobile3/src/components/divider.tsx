import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export interface DividerProps extends ViewProps {
  label?: string;
}

function Divider({ label, style, ...props }: DividerProps) {
  const theme = useTheme();
  return (
    <View style={[styles.wrapper, style]} {...props}>
      <View
        style={[styles.line, { backgroundColor: theme.backgroundSelected }]}
      />
      {!!label && (
        <ThemedText type="small" style={styles.text}>
          {label}
        </ThemedText>
      )}
      {!!label && (
        <View
          style={[styles.line, { backgroundColor: theme.backgroundSelected }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  text: {
    marginHorizontal: Spacing.two,
  },
});

export default Divider;
