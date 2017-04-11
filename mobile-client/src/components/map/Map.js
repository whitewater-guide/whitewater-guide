import React, { PropTypes } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native';

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.object,
  };

  static defaultProps = {
    initialBounds: null,
  };

  onMapLayout = () => {
    const { initialBounds } = this.props;
    if (initialBounds && this.mapView) {
      this.mapView.fitToCoordinates(
        [
          { latitude: initialBounds.sw.lat, longitude: initialBounds.sw.lng },
          { latitude: initialBounds.ne.lat, longitude: initialBounds.ne.lng },
        ],
        {
          edgePanning: { top: 10, bottom: 10, left: 10, right: 10 },
          animated: true,
        },
      );
    }
  };

  setMapView = (mapView) => { this.mapView = mapView; };

  render() {
    return (
      <MapView
        ref={this.setMapView}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        onLayout={this.onMapLayout}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default Map;

