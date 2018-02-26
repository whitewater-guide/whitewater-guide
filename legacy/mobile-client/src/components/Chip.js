import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from './index';

const styles = StyleSheet.create({
  chip: {
    height: 32,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    marginHorizontal: 2,
    marginVertical: 4,
  },
  chipText: {
    fontSize: 12,
  },
});

const Chip = ({ color, label, icon, onPress }) => {
  const iconView = icon && <Icon width={24} height={32} icon={icon} color={color} />;
  const paddingLeft = icon ? 4 : 8;
  const body = (
    <View style={[{ paddingLeft, borderColor: color }, styles.chip]}>
      { iconView }
      <Text style={[{ color }, styles.chipText]}>{label}</Text>
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress}>
        { body }
      </TouchableOpacity>
    );
  }
  return body;
};

Chip.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

Chip.defaultProps = {
  color: 'black',
  onPress: null,
  icon: null,
};

export default Chip;
