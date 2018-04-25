import React from 'react';
import { StyleSheet, Text, View, ViewProperties } from 'react-native';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.border,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textMain,
  },
});

interface Props extends ViewProperties {
  label: string;
}

export const Chip: React.StatelessComponent<Props> = ({ label, ...props }) => (
  <View {...props} style={[styles.container, props.style]}>
    <Text style={styles.label}>{label}</Text>
  </View>
);
