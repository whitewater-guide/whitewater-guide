import PropTypes from 'prop-types';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet, StatusBar } from 'react-native';
import { getBoundsZoomLevel, computeDistanceBetween, computeOffset, getBBox } from '../../commons/utils/GeoUtils';
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
    requestGeolocation: PropTypes.bool.isRequired,
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
    this._requestedGeolocation = !props.requestGeolocation;
    const [minLng, maxLng, minLat, maxLat] = getBBox(props.initialBounds);
    this._initialRegion = {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: (maxLat - minLat) / 2,
      longitudeDelta: (maxLng - minLng) / 2,
    };
  }

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (this._mapLaidOut) {
      return;
    }
    this._mapLaidOut = true;
    this.dimensions = { width, height };
    const { initialBounds } = this.props;
    if (initialBounds && this.mapView) {
      if (!this._requestedGeolocation) {
        this._requestedGeolocation = true;
        navigator.geolocation.getCurrentPosition(
          this.onGeolocationSuccess,
          () => {},
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
        );
      }
    }
  };

  onGeolocationSuccess = ({ coords: { latitude, longitude } }) => {
    // If the user is inside region, center map on user
    // If region is quite wide, zoom to 100 km radius
    const [minLng, maxLng, minLat, maxLat] = getBBox(this.props.initialBounds);
    if (this.mapView && latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng) {
      if (computeDistanceBetween([minLng, minLat], [maxLng, maxLat]) < 150) {
        this.mapView.animateToCoordinate({ latitude, longitude }, 300);
      } else {
        const corner = computeOffset({ latitude, longitude }, 100, -45);
        this.mapView.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: Math.abs(latitude - corner.latitude),
            longitudeDelta: Math.abs(longitude - corner.longitude),
          },
          300,
        );
      }
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
    this.props.onBoundsSelected(this._bounds);
  };

  setMapView = (mapView) => { this.mapView = mapView; };

  render() {
    return (
      <MapView
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={this._initialRegion}
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

