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
    height: 45,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonSmall: {
    height: 32,
  },
  buttonFullWidth: {
    alignSelf: 'stretch',
  },
  label: {
    fontFamily: theme.font.family,
    color: theme.colors.textMain,
  },
  labelPrimary: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.regular,
  },
  labelSmall: {
    fontSize: theme.font.size.note,
  },
});

const Button = (props) => {
  const { primary, fullWidth, small, style, labelStyle, label, ...rest } = props;
  const text = primary ? (label || '').toUpperCase() : label;
  let buttonStyle = [styles.button];
  let textStyle = [styles.label];
  if (primary) {
    buttonStyle = [...buttonStyle, styles.buttonPrimary];
    textStyle = [...textStyle, styles.labelPrimary];
  }
  if (small) {
    buttonStyle = [...buttonStyle, styles.buttonSmall];
    textStyle = [...textStyle, styles.labelSmall];
  }
  if (fullWidth) {
    buttonStyle = [...buttonStyle, styles.buttonFullWidth];
  }
  buttonStyle = [...buttonStyle, style];
  textStyle = [...textStyle, labelStyle];
  return (
    <TouchableItem style={buttonStyle} {...rest}>
      <Text style={textStyle}>{text}</Text>
    </TouchableItem>
  );
};

Button.propTypes = {
  fullWidth: PropTypes.bool,
  primary: PropTypes.bool,
  small: PropTypes.bool,
  label: PropTypes.string,
  style: PropTypes.any,
  labelStyle: PropTypes.any,
};

Button.defaultProps = {
  fullWidth: false,
  primary: false,
  small: false,
  label: '',
  style: null,
  labelStyle: null,
};

export default Button;

