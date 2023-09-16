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

export const Row: React.FC<ViewProps> = (props) => (
  <View {...props} style={[styles.row, props.style]}>
    {props.children}
  </View>
);

export interface LeftProps extends ViewProps {
  row?: boolean;
}

export const Left: React.FC<LeftProps> = ({ row, style, ...props }) => (
  <View {...props} style={[styles.left, row && styles.flexRow, style]} />
);

export interface RightProps extends ViewProps {
  row?: boolean;
}

export const Right: React.FC<RightProps> = ({ row, style, ...props }) => (
  <View {...props} style={[styles.right, row && styles.flexRow, style]} />
);

export const Body: React.FC<ViewProps> = ({ style, ...props }) => (
  <View {...props} style={[styles.body, style]} />
);
