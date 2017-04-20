import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Animated, Linking, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ITEM_HEIGHT } from './SectionListBody';

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
  return (
    <TouchableOpacity onPress={directionsHandler}>
      <Animated.View
        style={[
          styles.button,
          {
            opacity: driver.interpolate({
              inputRange,
              outputRange: [1, 0],
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: [{
              scale: driver.interpolate({
                inputRange,
                outputRange: [1, 0.7],
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
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
