import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous-native';
import { Text, TouchableOpacity } from 'react-native';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const styles = {
  regular: {
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 45,
      height: 45,
    },
    label: {
      ...theme.font.regular,
    },
  },
  fullWidth: {
    button: {
      flex: 1,
    },
  },
  primary: {
    button: {
      backgroundColor: theme.colors.primary,
    },
    label: {
      color: theme.colors.textLight,
    },
  },
  small: {
    button: {
      minHeight: 32,
      height: 32,
    },
    label: {
      fontSize: theme.font.note.fontSize,
    },
  },
  outlined: {
    button: {
      borderColor: theme.colors.primary,
      borderWidth: 1,
      backgroundColor: 'transparent',
    },
    label: {
      color: theme.colors.primary,
    },
  },
  link: {
    button: {
      backgroundColor: 'transparent',
    },
    label: {
      color: theme.colors.primary,
    },
  },
};

const Label = glamorous(Text)(
  styles.regular.label,
  props => ['fullWidth', 'primary', 'small', 'outlined', 'link'].reduce(
    (style, attribute) => (props[attribute] ? { ...style, ...styles[attribute].label } : style),
    { },
  ),
);

const ButtonInternal = glamorous(TouchableItem, { rootEl: TouchableOpacity })(
  styles.regular.button,
  props => ['fullWidth', 'primary', 'small', 'outlined', 'link'].reduce(
    (style, attribute) => (props[attribute] ? { ...style, ...styles[attribute].button } : style),
    { paddingHorizontal: props.padding },
  ),
);

const Button = (props) => {
  const { primary, fullWidth, small, outlined, link, style, labelStyle, label, padding, ...rest } = props;
  const attributes = { primary, fullWidth, small, outlined, link, padding };
  const text = primary ? (label || '').toUpperCase() : label;
  return (
    <ButtonInternal {...attributes} style={style} {...rest}>
      <Label {...attributes} style={labelStyle}>{text}</Label>
    </ButtonInternal>
  );
};

Button.propTypes = {
  ...TouchableItem.propTypes,
  /** Style variations  **/
  fullWidth: PropTypes.bool,
  primary: PropTypes.bool,
  small: PropTypes.bool,
  outlined: PropTypes.bool,
  link: PropTypes.bool,
  /** Props **/
  label: PropTypes.string,
  padding: PropTypes.number,
  /** Styles **/
  style: PropTypes.any,
  labelStyle: PropTypes.any,
};

Button.defaultProps = {
  fullWidth: false,
  primary: false,
  small: false,
  outlined: false,
  link: false,
  padding: 0,
  label: '',
  style: null,
  labelStyle: null,
};

export default Button;

