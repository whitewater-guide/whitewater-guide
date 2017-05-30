import PropTypes from 'prop-types';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet, StatusBar } from 'react-native';
import { getBoundsZoomLevel, getBBox } from '../../commons/utils/GeoUtils';
import { NAVIGATE_BUTTON_HEIGHT } from '../NavigateButton';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: window.height - NAVIGATE_BUTTON_HEIGHT - 56 - StatusBar.currentHeight, // 56 is top bar height android
  },
});

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onZoom: PropTypes.func.isRequired,
    onSectionSelected: PropTypes.func,
    onPOISelected: PropTypes.func,
    onBoundsSelected: PropTypes.func,
  };

  static defaultProps = {
    initialBounds: null,
    useSectionShapes: false,
  };

  constructor(props) {
    super(props);
    this.dimensions = { ...window };
    this._mapLaidOut = false; // Prevents map from resetting after keyboard was popped by search bar
    this._bounds = undefined;
  }

  componentWillUnmount() {
    if (this.props.onBoundsSelected) {
      this.props.onBoundsSelected(this._bounds);
    }
  }

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (this._mapLaidOut) {
      return;
    }
    this._mapLaidOut = true;
    this.dimensions = { width, height };
    const { initialBounds } = this.props;
    if (initialBounds && this.mapView) {
      const [minLng, maxLng, minLat, maxLat] = getBBox(initialBounds);
      this.mapView.fitToCoordinates(
        [
          { latitude: minLat, longitude: minLng },
          { latitude: maxLat, longitude: maxLng },
        ],
        {
          edgePanning: { top: 10, bottom: 10, left: 10, right: 10 },
          animated: false,
        },
      );
    }
  };

  onDeselect = () => {
    const { onSectionSelected, onPOISelected } = this.props;
    if (onSectionSelected && onPOISelected) {
      this.props.onSectionSelected(null);
      this.props.onPOISelected(null);
    }
  };

  onRegionChange = (region) => {
    this._bounds = [
      [region.longitude - region.longitudeDelta, region.latitude - region.latitudeDelta],
      [region.longitude + region.longitudeDelta, region.latitude + region.latitudeDelta],
    ];
    const zoomLevel = getBoundsZoomLevel(this._bounds, this.dimensions);
    this.props.onZoom(zoomLevel);
  };

  setMapView = (mapView) => { this.mapView = mapView; };

  render() {
    return (
      <MapView
        ref={this.setMapView}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        onPress={this.onDeselect}
        onLayout={this.onMapLayout}
        onRegionChange={this.onRegionChange}
        onMarkerDeselect={this.onDeselect}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default Map;

