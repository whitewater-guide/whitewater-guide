import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
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

const renderSimplePOI = (poi, isSelected, selectPOI) => {
  const {
    coordinates: [longitude, latitude],
    name,
    description,
    kind,
    _id,
  } = poi;
  // console.tron.log(poi);
  return (
    <MapView.Marker
      anchor={Anchor}
      title={name || kind}
      description={description}
      onPress={selectPOI}
      key={_id}
      coordinate={{ longitude, latitude }}
    >
      { renderCustomMarkerView(kind) }
    </MapView.Marker>
  );
};

export default renderSimplePOI;
