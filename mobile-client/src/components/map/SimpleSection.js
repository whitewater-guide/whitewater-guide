import React, { PropTypes } from 'react';
import MapView from 'react-native-maps';
import { SectionPropType } from '../../commons/features/sections';

const SimpleSection = (section, isSelected, selectSection) => {
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
      strokeWidth={3}
      strokeColor={isSelected ? 'red' : 'black'}
      onPress={selectSection}
      key={section._id}
      coordinates={coordinates}
    />
  );
};

SimpleSection.propTypes = {
  section: SectionPropType.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectSection: PropTypes.func.isRequired,
};

export default SimpleSection;
