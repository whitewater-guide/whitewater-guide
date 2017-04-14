import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Content } from 'native-base';

export function Screen({ children, style, noScroll }) {
  if (noScroll) {
    return (
      <View style={[StyleSheet.absoluteFill, style]}>
        { children }
      </View>
    );
  }
  return (
    <Container>
      <Content contentContainerStyle={style}>
        { children }
      </Content>
    </Container>
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
