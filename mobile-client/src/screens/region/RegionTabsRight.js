import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { BurgerButton } from '../../components';
import FilterButton from './FilterButton';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

const RegionTabsRight = ({ navigation }) => (
  <View style={styles.container}>
    <FilterButton />
    <BurgerButton navigation={navigation} />
  </View>
);

RegionTabsRight.propTypes = {
  navigation: PropTypes.object.isRequired,
};

RegionTabsRight.displayName = 'RegionTabsRight';

export default RegionTabsRight;
