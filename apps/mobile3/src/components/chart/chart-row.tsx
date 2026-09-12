import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { RowHeight, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ChartRow({ style, ...props }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={[
        styles.row,
        { borderBottomColor: theme.backgroundSelected },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: RowHeight,
    overflow: 'hidden',
  },
});
