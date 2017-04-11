import React from 'react';
import MapView from 'react-native-maps';

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
      title={name || kind}
      description={description}
      onPress={selectPOI}
      key={_id}
      coordinate={{ longitude, latitude }}
    />
  );
};

export default renderSimplePOI;
