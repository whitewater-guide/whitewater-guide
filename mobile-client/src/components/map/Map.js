import PropTypes from 'prop-types';
import React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Dimensions, StyleSheet } from 'react-native';
import { getBoundsZoomLevel, deltaRegionToArrayBounds } from '../../commons/utils/GeoUtils';

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.object,
    onZoom: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialBounds: null,
  };

  constructor(props) {
    super(props);
    this.dimensions = Dimensions.get('window');
  }

  onMapLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.dimensions = { width, height };
    const { initialBounds } = this.props;
    if (initialBounds && this.mapView) {
      this.mapView.fitToCoordinates(
        [
          { latitude: initialBounds.sw[1], longitude: initialBounds.sw[0] },
          { latitude: initialBounds.ne[1], longitude: initialBounds.ne[0] },
        ],
        {
          edgePanning: { top: 10, bottom: 10, left: 10, right: 10 },
          animated: true,
        },
      );
    }
  };

  onRegionChange = (region) => {
    const bounds = deltaRegionToArrayBounds(region);
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
        onLayout={this.onMapLayout}
        onRegionChange={this.onRegionChange}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default Map;

