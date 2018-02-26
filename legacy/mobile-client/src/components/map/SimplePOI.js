import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Svg, Circle } from 'react-native-svg';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
});

const IconKinds = {
  'put-in': 'arrow-downward',
  'take-out': 'arrow-upward',
  'put-in-alt': 'arrow-downward',
  'put-in-road': 'local-parking',
  'take-out-alt': 'arrow-upward',
  'take-out-road': 'local-parking',
  waterfall: 'adjust', // TODO: google maps online have icon for waterfall
  rapid: 'adjust',
  portage: 'directions-walk',
  playspot: 'stars',
  hazard: 'warning',
  'river-campsite': 'adjust',
  'wild-camping': 'adjust',
  'paid-camping': 'adjust',
  gauge: 'straighten',
  'hike-waypoint': 'adjust',
  bridge: 'adjust',
  other: 'adjust',
};

const Anchor = { x: 0.5, y: 0.5 };

const renderCustomMarkerView = (kind) => {
  const icon = IconKinds[kind] || 'adjust';
  return (
    <View style={styles.iconContainer}>
      <Icon name={icon} color="white" />
    </View>
  );
};

const renderCircle = (zoom, selected) => {
  const radius = zoom / 2;
  return (
    <Svg width={radius * 2} height={radius * 2}>
      <Circle
        cx={radius}
        cy={radius}
        r={radius}
        fill={selected ? 'red' : 'black'}
      />
    </Svg>
  );
};

const SimplePOI = ({ poi, selected, onPOISelected, zoom }) => {
  if (zoom < 3) {
    return null;
  }
  const { coordinates: [longitude, latitude], kind } = poi;

  let inner = null;
  if (zoom < 12) {
    inner = renderCircle(zoom);
  } else {
    inner = renderCustomMarkerView(kind);
  }
  return (
    <MapView.Marker
      anchor={Anchor}
      onPress={() => onPOISelected(poi)}
      coordinate={{ longitude, latitude }}
    >
      { inner }
    </MapView.Marker>
  );
};

export default SimplePOI;
