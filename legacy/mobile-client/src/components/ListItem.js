import React from 'react';
import glamorous from 'glamorous-native';
import { StyleSheet, View } from 'react-native';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
});

export const ListItem = (props) => {
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
