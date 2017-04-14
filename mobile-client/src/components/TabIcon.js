import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'native-base';

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  badge: {
    position: 'absolute',
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { translateX: 10 },
      { translateY: -12 },
    ],
  },
});

const TabIcon = ({ counter, icon, tintColor }) => {
  const prefix = Platform.OS === 'ios' ? 'ios' : 'md';
  const countStr = counter > 9 ? '9+' : counter.toString();
  return (
    <View style={styles.container}>
      <Icon name={`${prefix}-${icon}`} size={32} color={tintColor} />
      {
        counter > 0 &&
        <View style={styles.badge}>
          <Text style={{ color: tintColor }}>{countStr}</Text>
        </View>
      }
    </View>
  );
};

TabIcon.propTypes = {
  counter: PropTypes.number,
  icon: PropTypes.string.isRequired,
  tintColor: PropTypes.string,
};

TabIcon.defaultProps = {
  counter: 0,
  tintColor: '#FFF',
};

export default TabIcon;

