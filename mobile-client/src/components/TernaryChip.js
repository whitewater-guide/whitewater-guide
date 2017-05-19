import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Chip from './Chip';

const Colors = {
  selected: 'green',
  deselected: 'red',
  none: 'black',
};

const Icons = {
  selected: Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark',
  deselected: Platform.OS === 'ios' ? 'ios-close' : 'md-close',
  none: Platform.OS === 'ios' ? 'ios-radio-button-off-outline' : 'md-radio-button-off',
};

export const TernaryChip = ({ selection, label, onPress }) => (
  <Chip
    color={Colors[selection]}
    icon={Icons[selection]}
    label={label}
    onPress={onPress}
  />
);

TernaryChip.propTypes = {
  selection: PropTypes.oneOf(['selected', 'deselected', 'none']),
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

TernaryChip.defaultProps = {
  selection: 'none',
  onPress: null,
};
