import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

export default class SectionMapLayout extends PureComponent {

  static propTypes = {
    mapView: PropTypes.element.isRequired,
    selectedSectionView: PropTypes.element.isRequired,
    selectedPOIView: PropTypes.element.isRequired,
  };

  render() {
    const { mapView, selectedSectionView, selectedPOIView } = this.props;
    return (
      <View style={StyleSheet.absoluteFill}>
        { mapView }
        { selectedSectionView }
        { selectedPOIView }
      </View>
    );
  }

}
