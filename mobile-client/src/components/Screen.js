import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const TOP_LEFT = { x: 0, y: 0 };

export function Screen({ children, style, noScroll }) {
  if (noScroll) {
    return (
      <View style={[StyleSheet.absoluteFill, style]}>
        { children }
      </View>
    );
  }
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={style}
      automaticallyAdjustContentInsets={false}
      resetScrollToCoords={TOP_LEFT}
    >
      { children }
    </KeyboardAwareScrollView>
  );
}

Screen.propTypes = {
  children: PropTypes.node,
  noScroll: PropTypes.bool,
  style: PropTypes.any,
};

Screen.defaultProps = {
  children: null,
  noScroll: false,
  style: null,
};
