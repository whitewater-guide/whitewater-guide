import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch, compose, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { currentScreenSelector } from '../../utils';

class MapLayout extends Component {
  static propTypes = {
    mapView: PropTypes.element.isRequired,
    selectedSectionView: PropTypes.element.isRequired,
    selectedPOIView: PropTypes.element.isRequired,
  };

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        { this.props.mapView }
        { this.props.selectedSectionView }
        { this.props.selectedPOIView }
      </View>
    );
  }
}

// TODO: this causes overlapping maps until https://github.com/airbnb/react-native-maps/issues/1161 gets fixed
// https://github.com/airbnb/react-native-maps/pull/1311 didn't fix it for me
// So the workaround is to render map on it's own screen
export default displayOnScreen => compose(
  connect(state => ({ currentScreen: currentScreenSelector(state) })),
  branch(
    ({ currentScreen }) => currentScreen.routeName !== displayOnScreen,
    renderNothing,
  ),
)(MapLayout);
