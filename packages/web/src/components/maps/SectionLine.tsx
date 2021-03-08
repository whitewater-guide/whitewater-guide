/* eslint-disable @typescript-eslint/no-redeclare */
import { getSectionColor, useMapSelection } from '@whitewater-guide/clients';
import { Point, Section } from '@whitewater-guide/commons';
import React, { useEffect, useRef } from 'react';

import { MapElementProps } from './types';

const getStyle = (
  section: Section,
  selection: Section | Point | null,
  zoom = 1,
) => {
  const color = getSectionColor(section);
  const isSelected = !!selection && section.id === selection.id;
  return {
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1,
    strokeWeight: isSelected ? 6 : 4,
    icons: [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: Math.min(3, zoom / 3),
        },
        offset: '100%',
      },
    ],
  };
};

const getPaths = ({ putIn, takeOut, shape }: Section, detailed?: boolean) => {
  const coords =
    detailed && shape ? shape : [putIn.coordinates, takeOut.coordinates];
  return coords.map(([lng, lat]) => ({ lat, lng }));
};

interface Props extends MapElementProps {
  section: Section;
  detailed?: boolean;
}

const SectionLine = React.memo<Props>(({ section, map, zoom, detailed }) => {
  const { selection, onSelected } = useMapSelection();
  const lineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (lineRef.current) {
      return;
    }
    lineRef.current = new google.maps.Polyline({
      path: getPaths(section, detailed),
      map,
      ...getStyle(section, selection, zoom),
      clickable: !detailed,
    });
    google.maps.event.addListener(lineRef.current, 'click', () => {
      onSelected(section);
    });
    return () => {
      if (lineRef.current) {
        google.maps.event.clearListeners(lineRef.current, 'click');
        lineRef.current.setMap(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (lineRef.current) {
      lineRef.current.setOptions(getStyle(section, selection, zoom));
    }
  }, [section, zoom, selection, lineRef]);

  return null;
});

SectionLine.displayName = 'SectionLine';

export default SectionLine;
