import React, { useCallback } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import theme from '../../theme';
import ModalPickerItem from './ModalPickerItem';

const getItemLayout = (_: any, index: number) => ({
  length: theme.rowHeight,
  offset: index * theme.rowHeight,
  index,
});

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

interface Props<V> {
  value: V;
  onItemPress: (value: V) => void;
  valueToString: (value: V) => string;
  options: V[];
  keyExtractor: (value: V) => string;
  itemStyle?: StyleProp<ViewStyle>;
}

function ModalPickerList<V>(props: Props<V>) {
  const {
    onItemPress,
    value,
    valueToString,
    options,
    keyExtractor,
    itemStyle,
  } = props;
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<V>) => (
      <ModalPickerItem<V>
        value={item}
        selected={value}
        onPress={onItemPress}
        label={valueToString(item)}
        style={itemStyle}
      />
    ),
    [value, valueToString, onItemPress, itemStyle],
  );
  return (
    <FlatList<V>
      style={styles.list}
      data={options}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialScrollIndex={options.indexOf(value)}
      initialNumToRender={options.length}
    />
  );
}

ModalPickerList.displayName = 'ModalPickerList';

export default ModalPickerList;
