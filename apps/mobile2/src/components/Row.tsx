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
  flexRow: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
});

export function Row({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.row, style]} />;
}

export interface LeftProps extends ViewProps {
  row?: boolean;
}

export function Left({ row, style, ...props }: LeftProps) {
  return <View {...props} style={[styles.left, row && styles.flexRow, style]} />;
}

export interface RightProps extends ViewProps {
  row?: boolean;
}

export function Right({ row, style, ...props }: RightProps) {
  return <View {...props} style={[styles.right, row && styles.flexRow, style]} />;
}

export function Body({ style, ...props }: ViewProps) {
  return <View {...props} style={[styles.body, style]} />;
}
