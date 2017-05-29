import PropTypes from 'prop-types';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
import { getBoundsZoomLevel, getBBox } from '../../commons/utils/GeoUtils';

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    onZoom: PropTypes.func.isRequired,
    onSectionSelected: PropTypes.func.isRequired,
    onPOISelected: PropTypes.func.isRequired,
    onBoundsSelected: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialBounds: null,
    useSectionShapes: false,
  };

  constructor(props) {
    super(props);
    this.dimensions = Dimensions.get('window');
    this._mapLaidOut = false; // Prevents map from resetting after keyboard was popped by search bar
    this._bounds = undefined;
  }

  componentWillUnmount() {
    this.props.onBoundsSelected(this._bounds);
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

  onMarkerDeselect = () => {
    this.props.onSectionSelected(null);
    this.props.onPOISelected(null);
  };

  onPress = () => {
    this.props.onSectionSelected(null);
    this.props.onPOISelected(null);
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
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        onPress={this.onPress}
        onLayout={this.onMapLayout}
        onRegionChange={this.onRegionChange}
        onMarkerDeselect={this.onMarkerDeselect}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default Map;

