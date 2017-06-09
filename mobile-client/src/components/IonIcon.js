import PropTypes from 'prop-types';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const prefix = Platform.OS === 'ios' ? 'ios' : 'md';

const IonIcon = ({ icon, color, onPress, size }) => {
  if (onPress) {
    return (
      <TouchableItem onPress={onPress}>
        <Icon name={`${prefix}-${icon}`} size={size} color={color} />
      </TouchableItem>
    );
  }
  return (
    <Icon name={`${prefix}-${icon}`} size={size} color={color} />
  );
};

IonIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
  onPress: PropTypes.func,
  size: PropTypes.number,
};

IonIcon.defaultProps = {
  color: theme.colors.textMain,
  onPress: null,
  size: theme.icons.regular.size,
};

export default IonIcon;
