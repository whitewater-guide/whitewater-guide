import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated, Linking, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ITEM_HEIGHT } from '../screens/sections-list/item/SectionListBody';
import variables from '../theme/variables/platform';

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: ITEM_HEIGHT,
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

const NavigateButton = ({ driver, label, inputRange, coordinates }) => {
  const direcionsURL = `https://www.google.com/maps/dir/Current+Location/${coordinates[1]},${coordinates[0]}`;
  const directionsHandler = () => Linking.openURL(direcionsURL).catch(() => {});
  let opacityOutput = inputRange[0] <= inputRange[1] ? [1, 0] : [0, 1];
  let scaleOutput = inputRange[0] <= inputRange[1] ? [1, 0.7] : [0.7, 1];
  let inpRange = inputRange[0] <= inputRange[1] ? inputRange : inputRange.reverse();
  return (
    <TouchableOpacity onPress={directionsHandler}>
      <Animated.View
        style={[
          styles.button,
          {
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
          },
        ]}
      >
        <Icon name={Platform.OS === 'ios' ? 'ios-car' : 'md-car'} size={28} color="#333" />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

NavigateButton.propTypes = {
  label: PropTypes.string.isRequired,
  driver: PropTypes.any.isRequired,
  inputRange: PropTypes.array.isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default NavigateButton;
