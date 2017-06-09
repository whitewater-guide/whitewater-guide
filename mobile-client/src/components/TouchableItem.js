import React from 'react';
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';

const ANDROID_VERSION_LOLLIPOP = 21;

const TouchableItem = ({ style, children, ...rest }) => {
  if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
    return (
      <TouchableNativeFeedback
        {...rest}
        background={TouchableNativeFeedback.Ripple('rgba(0, 0, 0, 0.15)')}
      >
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity style={style} {...rest}>
      { children }
    </TouchableOpacity>
  );
};

TouchableItem.propTypes = {
  ...TouchableOpacity.propTypes,
};

export default TouchableItem;
