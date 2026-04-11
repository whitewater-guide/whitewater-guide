import React from 'react';
import type { ViewProps } from 'react-native';
import { StyleSheet, View } from 'react-native';

import theme from '../theme';

const styles = StyleSheet.create({
  row: {
    padding: theme.margin.single,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.rowHeight,
    overflow: 'hidden',
  },
});

export function Row({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.row, style]} />;
}
