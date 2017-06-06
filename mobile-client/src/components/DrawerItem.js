import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { currentScreenSelector } from '../utils';
import { toggleDrawer } from '../core/actions';
import TouchableItem from './TouchableItem';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});

const ACTIVE_TINT_COLOR = '#2196f3';
const ACTIVE_BACKGROUND_COLOR = 'rgba(0, 0, 0, .04)';
const INACTIVE_TINT_COLOR = 'rgba(0, 0, 0, .87)';
const INACTIVE_BACKGROUND_COLOR = 'transparent';

const DrawerItem = ({ focused, label, onPress }) => {
  const color = focused ? ACTIVE_TINT_COLOR : INACTIVE_TINT_COLOR;
  const backgroundColor = focused ? ACTIVE_BACKGROUND_COLOR : INACTIVE_BACKGROUND_COLOR;
  return (
    <TouchableItem onPress={onPress} delayPressIn={0}>
      <View style={[styles.item, { backgroundColor }]}>
        <Text style={[styles.label, { color }]}>
          {label}
        </Text>
      </View>
    </TouchableItem>
  );
};

DrawerItem.propTypes = {
  focused: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default connect(
  (state, props) => ({ focused: props.routeName === currentScreenSelector(state).routeName }),
  (dispatch, { routeName }) => ({
    onPress: () => {
      dispatch(toggleDrawer(false));
      dispatch(NavigationActions.navigate({ routeName }));
    },
  }),
)(DrawerItem);
