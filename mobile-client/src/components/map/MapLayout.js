import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { BlackPortal } from 'react-native-portal';

export default (portalName, requestGeolocation) => {
  class MapLayout extends React.Component {
    static propTypes = {
      mapView: PropTypes.element.isRequired,
      selectedSectionView: PropTypes.element.isRequired,
      selectedPOIView: PropTypes.element.isRequired,
    };

    constructor(props) {
      super(props);
      this._requestGeolocation = requestGeolocation;
    }

    shouldRequestGeolocation = () => {
      // Map gets mounted and unmounted while navigation changes, but should request geolocation only once
      const result = this._requestGeolocation;
      this._requestGeolocation = false;
      return result;
    };

    renderSelectedElements = () => {
      const { selectedSectionView, selectedPOIView } = this.props;
      if (!portalName) {
        return selectedSectionView;
      }
      return (
        <BlackPortal name={portalName}>
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            { selectedSectionView }
            { selectedPOIView }
          </View>
        </BlackPortal>
      );
    };

    render() {
      //TODO: move request geolocation into map component
      return (
        <View style={StyleSheet.absoluteFill}>
          { cloneElement(this.props.mapView, { requestGeolocation: this.shouldRequestGeolocation() }) }
          { this.renderSelectedElements() }
        </View>
      );
    }
  }

  return MapLayout;
};
