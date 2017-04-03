import React, { PropTypes } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { MapOfRegion } from '../../../commons/features/regions';

function renderSection(section, isSelected, selectSection) {
  const {
    putIn: { coordinates: [putInLng, putInLat] },
    takeOut: { coordinates: [takeOutLng, takeOutLat] },
  } = section;
  const coordinates = [
    { latitude: putInLat, longitude: putInLng },
    { latitude: takeOutLat, longitude: takeOutLng },
  ];
  return (
    <MapView.Polyline
      strokeWidth={2}
      strokeColor="red"
      onPress={selectSection}
      key={section._id}
      coordinates={coordinates}
    />
  );
}

class Map extends React.PureComponent {
  static propTypes = {
    initialBounds: PropTypes.object,
  };

  static defaultProps = {
    initialBounds: null,
  };

  render() {
    const { initialBounds } = this.props;
    let initialRegion;
    if (initialBounds) {
      initialRegion = {
        latitude: (initialBounds.sw.lat + initialBounds.ne.lat) / 2,
        longitude: (initialBounds.sw.lng + initialBounds.ne.lng) / 2,
        latitudeDelta: Math.abs(initialBounds.sw.lat - initialBounds.ne.lat) / 2,
        longitudeDelta: Math.abs(initialBounds.sw.lng - initialBounds.ne.lng) / 2,
      };
    }
    return (
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
      >
        { this.props.children }
      </MapView>
    );
  }
}

export default MapOfRegion(Map, renderSection, () => {});
