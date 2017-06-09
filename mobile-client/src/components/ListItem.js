import React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
});

const ListItem = (props) => {
  if (!props.onPress) {
    return (
      <View {...props} style={[styles.listItem, props.style]}>
        {props.children}
      </View>
    );
  }
  return (
    <TouchableItem {...props} style={[styles.listItem, props.style]}>
      {props.children}
    </TouchableItem>
  );
};

ListItem.propTypes = {
  ...TouchableItem.propTypes,
};

export default ListItem;
