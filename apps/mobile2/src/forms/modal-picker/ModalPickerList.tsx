import { useCallback, useEffect, useRef } from 'react';
import type {
  FlatList as FlatListType,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FlatList, StyleSheet } from 'react-native';

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

function ModalPickerList<V>({
  onItemPress,
  value,
  valueToString,
  options,
  keyExtractor,
  itemStyle,
}: Props<V>) {
  const listRef = useRef<FlatListType<V>>(null);

  useEffect(() => {
    const idx = options.indexOf(value);
    if (idx > 0) {
      listRef.current?.scrollToIndex({ index: idx, animated: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      ref={listRef}
      style={styles.list}
      data={options}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={options.length}
    />
  );
}

ModalPickerList.displayName = 'ModalPickerList';

export default ModalPickerList;
