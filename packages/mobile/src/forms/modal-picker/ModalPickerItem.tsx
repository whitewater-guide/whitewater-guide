import React, { useCallback } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Title, TouchableRipple } from 'react-native-paper';

import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: theme.rowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: theme.colors.componentBorder,
  },
});

interface Props<V> {
  value: V;
  selected: V;
  label: string;
  onPress: (value: V) => void;
  style?: StyleProp<ViewStyle>;
}

function ModalPickerItem<V>(props: Props<V>) {
  const { value, selected, label, onPress, style } = props;
  const onClick = useCallback(() => onPress(value), [value, onPress]);
  return (
    <TouchableRipple
      style={[styles.container, selected === value && styles.selected, style]}
      onPress={onClick}
    >
      <Title>{label}</Title>
    </TouchableRipple>
  );
}

ModalPickerItem.displayName = 'ModalPickerItem';

export default ModalPickerItem;
