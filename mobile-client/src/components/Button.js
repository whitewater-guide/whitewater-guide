import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
  },
  buttonFullWidth: {
    height: 45,
    alignSelf: 'stretch',
  },
  label: {
    fontFamily: theme.font.family,
    fontSize: theme.font.size.regular,
    color: theme.colors.textMain,
  },
  labelFullWidth: {
    color: theme.colors.textLight,
    fontSize: 16,
  },
});

const Button = ({ fullWidth, label, ...props }) => {
  const text = fullWidth ? (label || '').toUpperCase() : label;
  const buttonStyle = fullWidth ? styles.buttonFullWidth : null;
  const textStyle = fullWidth ? styles.labelFullWidth : null;
  return (
    <TouchableItem style={[styles.button, buttonStyle]} {...props}>
      <Text style={[styles.label, textStyle]}>{text}</Text>
    </TouchableItem>
  );
};

Button.propTypes = {
  fullWidth: PropTypes.bool,
  label: PropTypes.string,
};

Button.defaultProps = {
  fullWidth: false,
  label: '',
};

export default Button;

