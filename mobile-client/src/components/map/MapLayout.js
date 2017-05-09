import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

export default class MapLayout extends Component {
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
