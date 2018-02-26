import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import glamorous from 'glamorous-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import TouchableItem from './TouchableItem';
import theme from '../theme';

const prefix = Platform.OS === 'ios' ? 'ios' : 'md';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});

const Icon = ({ icon, iconRef, color, primary, onPress, onLongPress, size, large, style }) => {
  const clr = primary ? theme.colors.primary : color;
  const sz = large ? theme.icons.large.size : size;
  const name = (icon.indexOf('md-') === 0 || icon.indexOf('ios-') === 0) ? icon : `${prefix}-${icon}`;
  if (onPress || onLongPress) {
    return (
      <TouchableItem onPress={onPress} onLongPress={onLongPress} style={style}>
        <IonIcon ref={iconRef} name={name} size={sz} color={clr} />
      </TouchableItem>
    );
  }
  return (
    <View style={style}>
      <IonIcon ref={iconRef} name={name} size={sz} color={clr} />
    </View>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  iconRef: PropTypes.any,
  primary: PropTypes.bool,
  color: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  size: PropTypes.number,
  large: PropTypes.bool,
  style: PropTypes.any,
};

Icon.defaultProps = {
  color: theme.colors.textMain,
  primary: false,
  onPress: null,
  onLongPress: null,
  size: theme.icons.regular.size,
  large: false,
  style: null,
};

const GlamorousIcon = glamorous(Icon, { displayName: 'Icon' })(
  styles.button,
  ({ narrow, wide, width, height }) => {
    if (narrow) {
      return { width: undefined, height: undefined };
    } else if (wide) {
      return { width: 40 };
    } else if (width !== undefined || height !== undefined) {
      return { width, height };
    }
    return null;
  },
);

GlamorousIcon.propTypes = {
  ...Icon.propTypes,
  wide: PropTypes.bool,
  narrow: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default GlamorousIcon;
