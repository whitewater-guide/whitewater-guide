import React from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import { SectionPropType } from '../../commons/features/sections';

const SimpleSection = ({ section, selected, onSectionSelected, zoom }) => {
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
      strokeColor={selected ? 'red' : 'black'}
      onPress={() => onSectionSelected(section)}
      coordinates={coordinates}
    />
  );
};

SimpleSection.propTypes = {
  section: SectionPropType.isRequired,
  selected: PropTypes.bool,
  onSectionSelected: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
};

SimpleSection.defaultProps = {
  selected: false,
};

export default SimpleSection;
