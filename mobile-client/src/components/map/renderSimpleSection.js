import React from 'react';
import MapView from 'react-native-maps';

const renderSimpleSection = (section, isSelected, selectSection) => {
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

export default renderSimpleSection;
