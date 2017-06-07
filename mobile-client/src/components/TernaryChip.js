import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import theme from '../theme';
import Chip from './Chip';

const Colors = {
  selected: theme.colors.enabled,
  deselected: theme.colors.disabled,
  none: theme.colors.textNote,
};

const Icons = {
  selected: Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark',
  deselected: Platform.OS === 'ios' ? 'ios-close' : 'md-close',
  none: 'ios-radio-button-off-outline',
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
