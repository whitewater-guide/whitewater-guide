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
  };

  static defaultProps = {
    initialBounds: null,
    useSectionShapes: false,
  };

  constructor(props) {
    super(props);
    this.dimensions = Dimensions.get('window');
  }

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }) => {
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
    const bounds = [
      [region.longitude - region.longitudeDelta, region.latitude - region.latitudeDelta],
      [region.longitude + region.longitudeDelta, region.latitude + region.latitudeDelta],
    ];
    const zoomLevel = getBoundsZoomLevel(bounds, this.dimensions);
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

