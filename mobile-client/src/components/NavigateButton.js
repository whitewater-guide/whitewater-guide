import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated, Linking, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import variables from '../theme/variables/platform';

export const NAVIGATE_BUTTON_HEIGHT = 72;
export const NAVIGATE_BUTTON_WIDTH = 64;

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: variables.btnPrimaryBg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

const fadeStyle = ({ driver, inputRange }) => {
  const opacityOutput = inputRange[0] <= inputRange[1] ? [1, 0] : [0, 1];
  const scaleOutput = inputRange[0] <= inputRange[1] ? [1, 0.7] : [0.7, 1];
  const inpRange = inputRange[0] <= inputRange[1] ? inputRange : inputRange.reverse();
  return {
    opacity: driver.interpolate({
      inputRange: inpRange,
      outputRange: opacityOutput,
      extrapolate: 'clamp',
    }),
    transform: [{
      scale: driver.interpolate({
        inputRange: inpRange,
        outputRange: scaleOutput,
        extrapolate: 'clamp',
      }),
    }],
  };
};

const slideStyle = ({ driver, inputRange, position }) => {
  const inpRange = inputRange[0] <= inputRange[1] ? inputRange : inputRange.reverse();
  return {
    position: 'absolute',
    top: 0,
    right: driver.interpolate({
      inputRange: inpRange,
      outputRange: [-NAVIGATE_BUTTON_WIDTH, position * NAVIGATE_BUTTON_WIDTH],
      extrapolate: 'clamp',
    }),
  };
};

export const NavigateButton = ({ driver, label, inputRange, coordinates, animationType, position, style }) => {
  const direcionsURL = `https://www.google.com/maps/dir/Current+Location/${coordinates[1]},${coordinates[0]}`;
  const directionsHandler = () => Linking.openURL(direcionsURL).catch(() => {});
  const animatedStyle = animationType === 'fade' ?
    fadeStyle({ driver, inputRange }) :
    slideStyle({ driver, inputRange, position });
  return (
    <Animated.View style={[styles.buttonAnimatable, animatedStyle, style]}>
      <TouchableOpacity onPress={directionsHandler} style={styles.button}>
        <Icon name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'} size={28} color="#333" />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

NavigateButton.propTypes = {
  label: PropTypes.string.isRequired,
  driver: PropTypes.object.isRequired,
  inputRange: PropTypes.array.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  animationType: PropTypes.oneOf(['fade', 'slide']),
  position: PropTypes.number,
  style: PropTypes.any,
};

NavigateButton.defaultProps = {
  animationType: 'fade',
  position: 0,
};
