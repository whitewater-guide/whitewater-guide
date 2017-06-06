import PropTypes from 'prop-types';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
import { getBoundsZoomLevel, computeDistanceBetween, computeOffset, getBBox } from '../../commons/utils/GeoUtils';

const window = Dimensions.get('window');

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    contentBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onZoom: PropTypes.func.isRequired,
    onSectionSelected: PropTypes.func,
    onPOISelected: PropTypes.func,
    onBoundsSelected: PropTypes.func,
    requestGeolocation: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    initialBounds: null,
    contentBounds: null,
    useSectionShapes: false,
    onBoundsSelected: () => {},
  };

  constructor(props) {
    super(props);
    this.dimensions = { ...window };
    this._mapView = null;
    this._mapLaidOut = false; // Prevents map from resetting after keyboard was popped by search bar
    this._bounds = undefined;
    this._requestedGeolocation = !props.requestGeolocation;
    const [minLng, maxLng, minLat, maxLat] = getBBox(props.initialBounds || props.contentBounds);
    this._initialRegion = {
      latitude: (maxLat + minLat) / 2,
      longitude: (maxLng + minLng) / 2,
      latitudeDelta: (maxLat - minLat) / 2,
      longitudeDelta: (maxLng - minLng) / 2,
    };
  }

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    if (this._mapLaidOut || !this._mapView) {
      return;
    }
    this._mapLaidOut = true;
    this.dimensions = { width, height };
    const { initialBounds, contentBounds } = this.props;
    if (initialBounds) {
      if (!this._requestedGeolocation) {
        this._requestedGeolocation = true;
        navigator.geolocation.getCurrentPosition(
          this.onGeolocationSuccess,
          () => {},
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 },
        );
      }
    } else if (contentBounds) {
      const ir = this._initialRegion;
      this._mapView.fitToCoordinates(
        [
          { latitude: ir.latitude - ir.latitudeDelta, longitude: ir.longitude - ir.longitudeDelta },
          { latitude: ir.latitude + ir.latitudeDelta, longitude: ir.longitude + ir.longitudeDelta },
        ],
        {
          edgePadding: { left: 16, right: 16, top: 16, bottom: 16 },
          animated: false,
        },
      );
    }
  };

  onGeolocationSuccess = ({ coords: { latitude, longitude } }) => {
    // If the user is inside region, center map on user
    // If region is quite wide, zoom to 100 km radius
    const [minLng, maxLng, minLat, maxLat] = getBBox(this.props.initialBounds);
    if (this._mapView && latitude >= minLat && latitude <= maxLat && longitude >= minLng && longitude <= maxLng) {
      if (computeDistanceBetween([minLng, minLat], [maxLng, maxLat]) < 150) {
        this._mapView.animateToCoordinate({ latitude, longitude }, 300);
      } else {
        const corner = computeOffset({ latitude, longitude }, 100, -45);
        this._mapView.animateToRegion(
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

  setMapView = (mapView) => { this._mapView = mapView; };

  render() {
    return (
      <MapView
        showsUserLocation
        showsMyLocationButton={false}
        toolbarEnabled={false}
        initialRegion={this._initialRegion}
        ref={this.setMapView}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        onPress={this.onDeselect}
        onLayout={this.onMapLayout}
        onRegionChange={this.onRegionChange}
        onRegionChangeComplete={this.onRegionChange}
        onMarkerDeselect={this.onDeselect}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default Map;

