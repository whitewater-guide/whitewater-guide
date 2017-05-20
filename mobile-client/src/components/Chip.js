import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  chip: {
    height: 32,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    marginHorizontal: 2,
    marginVertical: 4,
  },
  iconWrapper: {
    width: 24,
    height: 32,
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
  },
});

const Chip = ({ color, label, icon, onPress }) => {
  const iconView = icon && icon !== 'none' && <Icon name={icon} size={24} color={color} />;
  const body = (
    <View style={[{ borderColor: color }, styles.chip]}>
      {
        icon &&
        <View style={styles.iconWrapper}>
          { iconView }
        </View>
      }
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
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

Chip.defaultProps = {
  color: 'black',
  onPress: null,
};

export default Chip;
