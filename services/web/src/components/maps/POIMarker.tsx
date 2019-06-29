import { useMapSelection } from '@whitewater-guide/clients';
import { Point } from '@whitewater-guide/commons';
import React, { useEffect, useRef } from 'react';
import { MapElementProps } from './types';

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
      icon: icon || {
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
