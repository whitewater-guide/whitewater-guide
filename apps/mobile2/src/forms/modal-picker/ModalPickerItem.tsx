import { useCallback } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

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

function ModalPickerItem<V>({
  value,
  selected,
  label,
  onPress,
  style,
}: Props<V>) {
  const onClick = useCallback(() => onPress(value), [value, onPress]);
  return (
    <TouchableRipple
      style={[styles.container, selected === value && styles.selected, style]}
      onPress={onClick}
    >
      <Text variant="titleMedium">{label}</Text>
    </TouchableRipple>
  );
}

ModalPickerItem.displayName = 'ModalPickerItem';

export default ModalPickerItem;
