import React from 'react';
import { TouchableHighlight, Platform, StyleSheet, TouchableNativeFeedback, View } from 'react-native';

const styles = StyleSheet.create({
  listItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#c9c9c9',
  },
});

const ListItem = (props) => {
  const style = props.style;
  if (Platform.OS === 'ios' || !props.onPress) {
    return (
      <TouchableHighlight
        onPress={props.onPress}
        underlayColor="#DDDDDD"
      >
        <View {...props} style={[styles.listItem, style]}>
          {props.children}
        </View>
      </TouchableHighlight>
    );
  }
  return (
    <TouchableNativeFeedback
      onPress={props.onPress}
      background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.15)')}
    >
      <View style={{ marginLeft: -17, paddingLeft: 17 }}>
        <View {...props} style={[styles.listItem, style]}>
          {props.children}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

ListItem.propTypes = {
  ...TouchableHighlight.propTypes,
};

export default ListItem;
