import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const prefix = Platform.OS === 'ios' ? 'ios' : 'md';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const IonIcon = ({ icon, color, onPress, size, style }) => {
  if (onPress) {
    return (
      <TouchableItem onPress={onPress} style={[styles.button, style]}>
        <Icon name={`${prefix}-${icon}`} size={size} color={color} />
      </TouchableItem>
    );
  }
  return (
    <View style={[styles.button, style]}>
      <Icon name={`${prefix}-${icon}`} size={size} color={color} />
    </View>
  );
};

IonIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPress: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.any,
};

IonIcon.defaultProps = {
  color: theme.colors.textMain,
  onPress: null,
  size: theme.icons.regular.size,
  style: null,
};

export default IonIcon;
