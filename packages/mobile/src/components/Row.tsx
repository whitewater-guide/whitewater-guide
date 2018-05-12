import glamorous from 'glamorous-native';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
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
  },
});

export const Row: React.StatelessComponent<ViewProps> = (props) => (
  <View {...props} style={[styles.row, props.style]}>
    {props.children}
  </View>
);

export const Left = glamorous(glamorous.View)({
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const Right = glamorous(glamorous.View)({
  alignItems: 'center',
  justifyContent: 'center',
});

export const Body = glamorous(glamorous.View)({
  flex: 1,
});