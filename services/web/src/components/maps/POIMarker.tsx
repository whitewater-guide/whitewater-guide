import React, { useEffect, useRef } from 'react';

import { MapElementProps } from './types';
import { Point } from '@whitewater-guide/commons';
import { useMapSelection } from '@whitewater-guide/clients';

const GaugeIcon = {
  url: require('./gauge_marker.png'),
  size: new google.maps.Size(26, 32),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(13, 16),
};

interface Props extends MapElementProps {
  poi: Point;
  clickable?: boolean;
  icon?: string | google.maps.Icon | google.maps.Symbol;
}

const POIMarker: React.FC<Props> = (props) => {
  const { map, poi, clickable, icon } = props;
  const markerRef = useRef<google.maps.Marker | null>(null);
  const { onSelected } = useMapSelection();
  useEffect(() => {
    if (markerRef.current) {
      return;
    }
    markerRef.current = new google.maps.Marker({
      position: { lat: poi.coordinates[1], lng: poi.coordinates[0] },
      map,
      clickable,
      icon:
        poi.kind === 'gauge'
          ? GaugeIcon
          : icon || {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
            },
    });
    markerRef.current.addListener('click', () => onSelected(poi));
    return () => {
      if (markerRef.current) {
        google.maps.event.clearListeners(markerRef.current, 'click');
        markerRef.current.setMap(null);
      }
    };
  }, [map]);
  return null;
};

export default POIMarker;
