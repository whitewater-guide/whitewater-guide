import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Chip from './Chip';

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
});

const Chips = ({ color, values }) => (
  <View style={styles.chips}>
    { values.map(v => (<Chip key={v} label={v} color={color} />)) }
  </View>
);

Chips.propTypes = {
  color: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Chips.defaultProps = {
  color: 'black',
};

export default Chips;
