import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import variables from '../../theme/variables/platform';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const FilterButton = () => (
  <TouchableOpacity style={styles.button}>
    <Icon name="ios-funnel-outline" size={20} color={variables.btnPrimaryBg} />
  </TouchableOpacity>
);

export default FilterButton;
