import React from 'react';
import { Animated, Linking, StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import theme from '../theme';
import { Coordinate } from '../ww-commons';
import { Icon } from './Icon';

export const NAVIGATE_BUTTON_HEIGHT = 72;
export const NAVIGATE_BUTTON_WIDTH = 64;

const styles = StyleSheet.create({
  button: {
    width: NAVIGATE_BUTTON_WIDTH,
    height: NAVIGATE_BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMain,
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
    transform: [{
      translateX: driver.interpolate({
        inputRange: inpRange,
        outputRange: [
          theme.screenWidth + NAVIGATE_BUTTON_WIDTH,
          theme.screenWidth - (position + 1) * NAVIGATE_BUTTON_WIDTH,
        ],
        extrapolate: 'clamp',
      }),
    }],
  };
};

interface Props {
  label: string;
  driver: any;
  inputRange: [number, number];
  coordinates: Coordinate;
  animationType?: 'fade' | 'slide';
  position?: number;
  style?: StyleProp<ViewStyle>;
}

export const NavigateButton: React.StatelessComponent<Props> = (props) => {
  const { driver, label, inputRange, coordinates, animationType = 'fade', position = 0, style } = props;
  const directionsURL = `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`;
  const directionsHandler = () => Linking.openURL(directionsURL).catch(() => {/*Ignore*/});
  const animatedStyle = animationType === 'fade' ?
    fadeStyle({ driver, inputRange }) :
    slideStyle({ driver, inputRange, position });
  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity onPress={directionsHandler} style={styles.button}>
        <Icon icon="car" size={28} />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
